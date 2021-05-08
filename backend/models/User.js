const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');
const Collection = require('./Collection');
const ErrorResponse = require('../utils/errorResponse');

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
    collections: {
      tracks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
      playlists: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
      albums: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
      artists: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Create liked songs collection
    const likedSongs = await Collection.create({
      type: 'track',
      name: 'Liked Songs',
      public: false,
      itemModel: 'Track',
    });
    this.collections.tracks = likedSongs._id;
    // Create following albums collection

    // Create following artists collection
    const followingArtists = await Collection.create({
      type: 'track',
      name: 'Following Artists',
      public: false,
      itemModel: 'Artist',
    });
    this.collections.artists = followingArtists._id;

    // Create following playlists collection
    const followingPlaylists = await Collection.create({
      type: 'playlist',
      name: 'Following Playlists',
      public: false,
      itemModel: 'Collection',
    });
    this.collections.playlists = followingPlaylists._id;
  }
  next();
});

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
    collections: this.collections,
  };
  const expiresIn = parseInt(process.env.JWT_EXPIRE);
  const accessToken = jwt.sign(userJWT, process.env.JWT_SECRET, {
    expiresIn,
  });
  return { userJWT, accessToken, exp: new Date().valueOf() + expiresIn };
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.statics.findByJWT = async function (token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await this.findById(decoded.uid);
};

module.exports = mongoose.model('User', UserSchema);
