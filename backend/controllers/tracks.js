const fetch = require('node-fetch');
const ytsearch = require('yt-search');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const Track = require('../models/Track');
const Collection = require('../models/Collection');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');

/**
 *  Mongo connect and GridFS
 */
let gridFSBucket;
let gridFSBucketImages;
const db = mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err, db) => {
    gridFSBucket = new mongoose.mongo.GridFSBucket(db.connection.db, { bucketName: 'tracks' });
    gridFSBucketImages = new mongoose.mongo.GridFSBucket(db.connection.db, {
      bucketName: 'images',
    });
  }
);

exports.searchTrack = asyncHandler(async (req, res) => {
  //'https://invidious.himiko.cloud/api/v1/search

  // Search for query in yt api
  // Match with DB
  const query = req.params.query;
  if (!query) return res.status(404).end();
  console.log('Query:', query);

  const results = await ytsearch({ query });

  // Filter videos (results)
  const videos = await Promise.all(
    results.videos.map(async (video) => {
      return {
        type: 'video',
        ago: video.ago,
        timestamp: video.timestamp,
        thumbnail: video.thumbnail,
        title: video.title,
        ytUrl: video.url,
        ytId: video.videoId,
        views: video.views,
        artist: video.author,
        mbox: await Track.findOne({ ytId: video.videoId }),
      };
    })
  );

  res.send({ videos });
});

exports.getTrack = async (req, res) => {
  const songs = await Track.find({});
  res.send({ songs });
};

const timeFormat = (duration) => {
  const min = Math.floor(duration / 60);
  const sec = Math.round(duration % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

exports.downloadTrack = asyncHandler(async (req, res) => {
  // Check youtube id param
  const ytId = req.params.ytId;
  if (!ytId) throw new ErrorResponse(400, 'Missing youtube id');

  // Check if track is already downloaded
  const trackExists = await Track.exists({ ytId });
  if (trackExists) throw new ErrorResponse(400, 'Track already downloaded');

  // Get video info
  const info = await ytdl.getInfo(ytId);
  if (!info) throw new ErrorResponse(404, 'Video not found');

  // Save track
  const lengthSeconds = parseInt(info.videoDetails.lengthSeconds, 10);
  const trackInfo = {
    name: info.videoDetails.title,
    ytId: info.videoDetails.videoId,
    ytUrl: info.videoDetails.video_url,
    publishDate: info.videoDetails.publishDate,
    duration: {
      seconds: lengthSeconds,
      timestamp: timeFormat(lengthSeconds),
    },
  };
  let track = await Track.create(trackInfo);

  // Add track to artist
  const artistInfo = {
    name: info.videoDetails.author.name,
    ytId: info.videoDetails.author.id,
    ytUrl: info.videoDetails.author.user_url,
  };
  const artist = await Artist.findOneAndUpdate(
    { ytId: artistInfo.ytId },
    { $setOnInsert: artistInfo, $push: { tracks: track._id } },
    { upsert: true, new: true }
  );

  // Download track
  const opt = {
    quality: 'highestaudio',
    format: 'audioonly',
  };
  ytdl
    .downloadFromInfo(info, opt)
    .pipe(gridFSBucket.openUploadStream(track._id))
    .on('finish', async (file) => {
      // Add artist and file to track
      track = { ...track.toObject(), artists: [artist._id], file: file._id };
      await Track.findByIdAndUpdate(track._id, track);

      res.send(track);
    });
});

exports.deleteTrack = asyncHandler(async (req, res) => {
  // Check track id param
  const trackId = req.params.trackId;
  if (!trackId) throw new ErrorResponse(400, 'Missing track id');

  // Delete track
  const deletedTrack = await Track.findByIdAndDelete(trackId);
  if (!deletedTrack) throw new ErrorResponse(404, 'Track does not exist');

  // Delete track file
  await gridFSBucket.delete(deletedTrack.file);

  // Remove track from artists
  await Promise.all(
    deletedTrack.artists.forEach(async (artists) => {
      await Artist.findByIdAndUpdate(artists, { $pull: { tracks: trackId } });
    })
  );

  res.send({ success: true });
});

exports.playTrack = async (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.statusCode = 403;
    return res.end();
  }

  const bucketId = mongoose.Types.ObjectId(req.params.bucketId);
  gridFSBucket.find({ _id: bucketId }).toArray((err, files) => {
    if (!files[0]) return res.end();

    const total = files[0].length;
    const [partialstart, partialend] = range.replace(/bytes=/, '').split('-');

    const start = parseInt(partialstart, 10);
    const end = partialend ? parseInt(partialend, 10) : total - 1;
    const chunksize = end - start + 1;

    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', chunksize);
    // res.setHeader('Content-Type', 'audio/mpeg');
    res.writeHead(206);
    gridFSBucket.openDownloadStream(bucketId, { start }).pipe(res);
  });
};

exports.likeTrack = asyncHandler(async (req, res) => {
  const trackId = req.params.trackId;
  if (!trackId) throw new ErrorResponse(400, 'Introduce track id');

  // Check if track exists
  const trackExists = await Track.exists({ _id: trackId });
  if (!trackExists) throw new ErrorResponse('Track does not exists');

  // Add
  const collectionId = req.user.collections.tracks;
  await Collection.findByIdAndUpdate(collectionId, {
    $push: { items: trackId },
  });

  res.send({ success: true });
});

exports.getLikedTracks = asyncHandler(async (req, res) => {
  const collectionId = req.user.collections.tracks;
  const likedTracks = await Collection.findById(collectionId).populate({
    path: 'items',
    populate: {
      path: 'artists',
    },
  });

  res.send(likedTracks);
});

exports.updateModel = async (req, res) => {
  const songs = await Track.find({}).populate('artist');
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(songs, null, 2));
};

exports.downloadImage = asyncHandler((req, res) => {
  const url = req.query.url;
  console.log(url);
  fetch(url).then((fres) => {
    return new Promise((resolve, reject) => {
      const dest = gridFSBucketImages.openUploadStream('tomasImage1');
      fres.body.pipe(dest);
      dest.on('finish', (file) => {
        res.send({ success: true, file });
        resolve();
        dest.on('error', reject);
      });
    });
  });
});

exports.viewImage = asyncHandler((req, res) => {
  const bucketId = mongoose.Types.ObjectId(req.params.imageId);
  gridFSBucketImages.openDownloadStream(bucketId).pipe(res);
});
