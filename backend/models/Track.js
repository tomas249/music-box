const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema(
  {
    name: String,
    ytId: {
      type: String,
      required: true,
      index: true,
    },
    ytUrl: String,
    duration: {
      seconds: Number,
      timestamp: String,
    },
    publishDate: String,
    artists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
      },
    ],
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tracks.files',
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'images.files',
    },
  },
  {
    timestamps: true,
  }
);

TrackSchema.pre('find', function (next) {
  this.populate('artist', 'name');
  next();
});

module.exports = mongoose.model('Track', TrackSchema);
