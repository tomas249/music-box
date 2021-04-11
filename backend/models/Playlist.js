const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  title: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
