const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');

const UserSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    fullname: String,
    password: {
      type: String,
      minlength: [4, 'Password field min length is 4 characters'],
      maxlength: [30, 'Password field max length is 30 characters'],
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    level: {
      type: Number,
      default: 1,
    },
    host: {
      name: String,
      fullname: String,
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    access: {
      bypass: {
        type: Boolean,
        default: false,
      },
      allow: {
        type: Boolean,
        default: false,
      },
      reason: String,
      message: String,
    },
  },
  { timestamps: true }
);

// Generate random id
const generateUsername = (name) => {
  /**
   * Output: name0000X (name + 4 integers + 1 letter)
   */
  // First part from timestamp
  const id = Date.now().toString().substr(-4);
  // Second part from random numbers
  const randNumber = Math.round(Math.random() * (90 - 65) + 65);
  // Username ends with a letter
  const end = String.fromCharCode(randNumber);
  // Concatonate and return
  return name.trim().toLowerCase().split(' ')[0] + id + end;
};

// // First time User is created
// UserSchema.pre('save', async function (next) {
//   this._wasNew = this.isNew;
//   // Validation to differentiate between created & updated
//   if (!this.isNew) next();

//   // Check if email is already in use
//   const emailExists = await this.model('User').exists({ email: this.email });
//   if (emailExists) {
//     throw new ErrorResponse(400, 'Email is already in use');
//   }

//   // Generate encrypted password using bcryptjs
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);

//   // Generate username
//   let generatedUsername;
//   let usernameExists = true;
//   // It checks if generated username already exists
//   // Usually run once but to certainly avoid duplicates
//   while (usernameExists) {
//     generatedUsername = generateUsername(this.name);
//     usernameExists = await this.model('User').exists({
//       username: generatedUsername,
//     });
//   }
//   this.username = generatedUsername;

//   // Create SocketUser
//   const socketUser = await SocketUser.create({ user: this._id });
//   this.socketId = socketUser._id;

//   next();
// });

// UserSchema.post('save', async function (doc) {
//   if (!this._wasNew) {
//     return;
//   }

//   // Generate follow schema
//   await this.model('Follow').create({
//     user: doc._id,
//   });
// });

UserSchema.statics.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  const userJWT = {
    _id: this._id,
    key: this.key,
    name: this.name,
    fullname: this.fullname,
    access: this.access,
  };
  const accessToken = jwt.sign(userJWT, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return { userJWT, accessToken };
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.statics.findByJWT = function (token, cb) {
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) throw new ErrorResponse(401, 'Invalid RefreshToken');
    const user = await this.findById(decoded.uid);
    cb(user);
  });
};

module.exports = mongoose.model('User', UserSchema);
