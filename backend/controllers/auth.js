const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const InvitationKey = require("../models/InvitationKey");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const Sniffr = require("sniffr");
const sniff = new Sniffr();

exports.createInvitation = asyncHandler(async (req, res) => {
  // Generate invitation key
  const key = Date.now().toString(36).substr(3).toUpperCase();

  // Invitation data
  let { validNames, validTime } = req.body;

  // Host data
  const host = {
    _id: req.user._id,
    fullname: req.user.fullname,
    name: req.user.name,
  };

  // Valid names list must be lowercase
  validNames = validNames.map((name) => name.toLowerCase());

  // Calculate expiry date
  const exp = new Date();
  exp.setDate(exp.getDate() + Number(validTime));

  const invitationKey = new InvitationKey({
    key,
    host,
    validNames,
    exp,
  });
  await invitationKey.save();
  res.send({ key });
});

exports.getInvitation = asyncHandler(async (req, res) => {
  // Search by key
  const key = req.params.key;
  const invitationKey = await InvitationKey.findOne({ key });
  if (!invitationKey)
    throw new ErrorResponse(400, `"${key}" is not a valid invitation key`);

  // Change date format at return
  const d = new Date(invitationKey.exp);
  const validUntil = `${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()} (${d.getHours()}:${d.getMinutes()})`;

  res.send({
    _id: invitationKey._id,
    key,
    invitedBy: invitationKey.host.name,
    remainingActivations: invitationKey.validNames.length,
    validUntil,
  });
});

exports.confirmInvitation = asyncHandler(async (req, res) => {
  const keyId = req.body.keyId;
  let fullname = req.body.fullname;

  if (!keyId) throw new ErrorResponse(400, "Please introduce a key id");
  if (!fullname)
    throw new ErrorResponse(400, "Please introduce your full name");

  // Split fullname
  fullname = fullname.toLowerCase().split(" ");

  // Fullname must have follow Name+Surname format
  if (fullname.length !== 2 && fullname.length !== 3)
    throw new ErrorResponse(400, "Invalid full name format");
  // Surname initials
  let surname = fullname.slice(-1)[0];
  // Name can be composed: first_name+second_name
  let names = fullname.slice(0, -1);

  // Validate invitation key
  const invitation = await InvitationKey.findById(keyId);
  let usedName;
  const inGuestList = invitation.validNames.some((gName) => {
    if (names.includes(gName)) {
      usedName = gName;
      return true;
    } else {
      return false;
    }
  });
  if (!inGuestList)
    throw new ErrorResponse(400, "Your name is not on the guest list");

  // Mark invitation as activated
  await InvitationKey.findByIdAndUpdate(keyId, {
    $push: { activatedBy: fullname.join(" ") },
    $pull: { validNames: usedName },
  });

  // Create default user and generate tokens
  const user = await createDefaultUser({
    user: { names, surname },
    host: invitation.host,
  });
  const { userJWT, accessToken } = user.getSignedJwtToken();
  const refreshToken = await generateRefreshToken(req, user._id);

  res
    .cookie("refresh-token", refreshToken, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      signed: true,
      sameSite: true,
    })
    .send({
      accessToken,
      user: userJWT,
    });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const newPassword = req.body.newPassword;
  if (!newPassword) throw new ErrorResponse(400, "New password not introduced");

  // Encrypt new password
  const password = await User.encryptPassword(newPassword);
  // Change access
  const access = {
    bypass: false,
    allow: true,
    reason: "",
    message: "",
  };
  // Update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { password, access },
    { new: true }
  );

  // Generate new tokens
  const { userJWT, accessToken } = user.getSignedJwtToken();
  const refreshToken = await generateRefreshToken(req, user._id);

  res
    .cookie("refresh-token", refreshToken, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      signed: true,
      sameSite: true,
    })
    .send({
      accessToken,

      user: userJWT,
    });
});

exports.login = asyncHandler(async (req, res) => {
  const key = req.body.key;

  // Search for user
  const user = await User.findOne({ key });
  if (!user)
    throw new ErrorResponse(401, `Invalid credentials for Access Key "${key}"`);

  // If account has not finished its setup, skip password match
  if (user.access.reason !== "setup_account") {
    const password = req.body.password;
    if (!password)
      throw new ErrorResponse(401, "Please introduce your password");

    // Check password match
    const pwdMatch = await user.matchPassword(password);
    if (!pwdMatch)
      throw new ErrorResponse(
        401,
        `Invalid credentials for Access Key "${key}"`
      );
  }

  // Send tokens
  const { userJWT, accessToken } = user.getSignedJwtToken();
  const refreshToken = await generateRefreshToken(req, user._id);
  res
    .cookie("refresh-token", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      signed: true,
      sameSite: true,
    })
    .send({
      accessToken,
      user: userJWT,
    });
});

exports.register = asyncHandler(async (req, res) => {
  // Split fullname
  const fullname = req.body.fullname.toLowerCase().split(" ");

  // Fullname must have follow Name+Surname format
  if (fullname.length !== 2 && fullname.length !== 3)
    throw new ErrorResponse(400, "Invalid full name format");

  // Surname initials
  let surname = fullname.slice(-1)[0];
  // Name can be composed: first_name+second_name
  let names = fullname.slice(0, -1);

  const user = {
    names,
    surname,
  };
  await createDefaultUser({ user, host: {} });
  res.send({ message: "Your user was created" });
});

exports.identify = asyncHandler(async (req, res) => {
  // Check refresh token
  const refreshToken = req.signedCookies["refresh-token"];
  if (!refreshToken) return res.send({ user: null, accessToken: null });

  const user = await User.findByJWT(refreshToken);
  if (!user) throw new ErrorResponse(400, "Invalid User");

  const { userJWT, accessToken } = user.getSignedJwtToken();
  res.send({ user: userJWT, accessToken });
});

const createDefaultUser = async ({ user, host }) => {
  let { names, surname } = user;
  let nameInitials = [];
  const name = names
    .map((name) => {
      const firstLetter = name.charAt(0).toUpperCase();
      nameInitials.push(firstLetter);
      return firstLetter + name.slice(1);
    })
    .join(" ");
  surname = surname.toUpperCase();

  const fullname = `${name} ${surname}`;
  const key = nameInitials.join("") + surname;

  try {
    return await User.create({
      key,
      name,
      surname,
      fullname,
      host,
      access: {
        bypass: true,
        allow: false,
        reason: "setup_account",
        message: "You need to complete your account setup",
      },
    });
  } catch (err) {
    if (err.code === 11000)
      throw new ErrorResponse(400, "Invitation already confirmed");
    else throw new ErrorResponse(400, err);
  }
};

const generateRefreshToken = async (req, uid) => {
  // Remove previous RefreshToken
  if (req.refreshToken) {
    await RefreshToken.findOneAndDelete({ token: req.refreshToken });
  }

  // Create RefreshToken's title
  sniff.sniff(req.headers["user-agent"]);
  const usedOS = sniff.os.name[0].toUpperCase() + sniff.os.name.slice(1);
  const usedBrowser =
    sniff.browser.name[0].toUpperCase() + sniff.browser.name.slice(1);
  const title = `${usedBrowser} on ${usedOS}`;

  // Create token
  const refreshToken = await RefreshToken.create({
    uid,
    title,
  });
  return refreshToken.token;
};
