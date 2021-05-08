const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Collection = require('../models/Collection');

exports.createPlaylist = asyncHandler(async (req, res) => {
  const name = req.body.name;
  if (!name) throw new ErrorResponse(400, 'Introduce playlist name');

  // Create playlist
  const playlist = await Collection.create({
    type: 'track',
    name,
    public: false,
    itemModel: 'Track',
  });

  // Add playlist to user's playlists
  const collectionId = req.user.collections.playlists;
  await Collection.findByIdAndUpdate(collectionId, {
    $push: { items: playlist._id },
  });

  res.send(playlist);
});

exports.getUserPlaylists = asyncHandler(async (req, res) => {
  const collectionId = req.user.collections.playlists;
  const playlist = await Collection.findById(collectionId).populate('items');
  res.send(playlist);
});

exports.getPlaylistById = asyncHandler(async (req, res) => {
  const collectionId = req.params.id;
  const playlist = await Collection.findById(collectionId).populate({
    path: 'items',
    populate: {
      path: 'artists',
    },
  });
  res.send(playlist);
});

exports.addToPlaylist = asyncHandler(async (req, res) => {
  const trackId = req.body.trackId;
  const playlistId = req.body.playlistId;

  if (!trackId || !playlistId) throw new ErrorResponse('Missing data');
  await Collection.findByIdAndUpdate(playlistId, {
    $addToSet: { items: trackId },
  });
  res.end();
});

exports.removeFromPlaylist = asyncHandler(async (req, res) => {
  const trackId = req.body.trackId;
  const playlistId = req.body.playlistId;

  if (!trackId || !playlistId) throw new ErrorResponse('Missing data');
  await Collection.findByIdAndUpdate(playlistId, {
    $pull: { items: trackId },
  });
  res.end();
});
