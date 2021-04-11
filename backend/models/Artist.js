const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: String,
  ytId: String,
  ytUrl: String,
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
  ],
});

module.exports = mongoose.model('Artist', ArtistSchema);
