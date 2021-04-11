const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: String,
  ytId: String,
  ytUrl: String,
  downloaded: Boolean,
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
  },
  bucket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'songs.files',
  },
});

SongSchema.pre('find', function (next) {
  this.populate('artist', 'name');
  next();
});

module.exports = mongoose.model('Song', SongSchema);
