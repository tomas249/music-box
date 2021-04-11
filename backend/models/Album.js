const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: String,
  date: Date,
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
});

module.exports = mongoose.model('Album', AlbumSchema);
