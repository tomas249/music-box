const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: String,
  ytId: {
    type: String,
    required: true,
    index: true,
  },
  ytUrl: String,
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'images.files',
  },
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
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
