const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: String,
  },
  { timestamps: true }
);

RefreshTokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.token = jwt.sign({ uid: this.uid }, process.env.JWT_SECRET);
  }
  next();
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
