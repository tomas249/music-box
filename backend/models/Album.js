const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
  name: String,
  date: String,
  image: {
    id: String,
  },
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

module.exports = mongoose.model("Album", AlbumSchema);
