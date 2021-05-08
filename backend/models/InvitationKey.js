const mongoose = require('mongoose');

const InvitationKeySchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
  },
  activatedBy: [String],
  host: {
    name: String,
    fullname: String,
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  validNames: [String],
  exp: String,
  valid: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('InvitationKey', InvitationKeySchema);
