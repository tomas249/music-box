const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Collection = require('../models/Collection');
const Artist = require('../models/Artist');

exports.getUserArtists = asyncHandler(async (req, res) => {
  const collectionId = req.user.collections.artists;
  const artists = await Collection.findById(collectionId).populate('items');
  res.send(artists);
});

exports.getArtistById = asyncHandler(async (req, res) => {
  const artistId = req.params.artistId;
  if (!artistId) throw new ErrorResponse(400, 'Introduce artistId');

  const artist = await Artist.findById(artistId).populate('tracks');
  res.send(artist);
});

exports.followArtist = asyncHandler(async (req, res) => {
  const artistId = req.params.artistId;
  if (!artistId) throw new ErrorResponse(400, 'Introduce artistId');

  // Add artist
  const collectionId = req.user.collections.artists;
  await Collection.findByIdAndUpdate(collectionId, {
    $addToSet: { items: artistId },
  });
  res.end();
});
