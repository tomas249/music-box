const fetch = require('node-fetch');
const search = require('youtube-search');
const ytdl = require('ytdl-core');
const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const Song = require('../models/Song');
const { finished } = require('stream/promises');

/**
 *  Mongo connect and GridFS
 */
let gridFSBucket;
const db = mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err, db) => {
    gridFSBucket = new mongoose.mongo.GridFSBucket(db.connection.db, { bucketName: 'songs' });
  }
);

exports.searchSong = (req, res) => {
  // Search for query in yt api
  // Match with DB
  const query = req.params.query;
  if (!query) return res.status(404).end();

  const opts = {
    maxResults: 5,
    key: process.env.YT_KEY,
  };

  search(query, opts, async (err, results) => {
    if (err) {
      console.error('Search failed: ' + query);
      return res.send([]);
    }

    const videos = await Promise.all(
      results.map(async (video) => {
        return { ...video, song: await Song.findOne({ ytId: video.id }) };
      })
    );
    res.send(videos);
  });
};

exports.saveSong = async (req, res) => {
  const videoId = req.params.videoId;

  // Check if song already exists
  const songExists = await Song.exists({ ytId: videoId });
  if (songExists) return res.status(400).send({ message: 'Song is already saved' });

  // Get video info
  const opt = {
    quality: 'highestaudio',
    format: 'audioonly',
  };
  const info = await ytdl.getInfo(videoId);

  // Save song
  const songInfo = {
    title: info.videoDetails.title,
    ytId: info.videoDetails.videoId,
    ytUrl: info.videoDetails.video_url,
    downloaded: false,
  };
  let song = await Song.create(songInfo);

  // Get artist or create one
  const artistInfo = {
    name: info.videoDetails.author.name,
    ytId: info.videoDetails.author.id,
    ytUrl: info.videoDetails.author.user_url,
  };
  const artist = await Artist.findOneAndUpdate(
    { ytId: artistInfo.ytId },
    { $setOnInsert: artistInfo, $push: { songs: song._id } },
    { upsert: true, new: true }
  );

  // Download song if requested
  song = { ...song.toObject(), artist: artist._id };

  const download = JSON.parse(req.query.download);
  if (download) {
    ytdl
      .downloadFromInfo(info, opt)
      .pipe(gridFSBucket.openUploadStream(song._id))
      .on('finish', async (file) => {
        song = { ...song, bucket: file._id, downloaded: true };
        await Song.findByIdAndUpdate(song._id, song);
        res.send(song);
      });
  } else {
    // Update song with artist id
    await Song.findByIdAndUpdate(song._id, song);
    res.send({ song });
  }
};

exports.getSongs = async (req, res) => {
  const songs = await Song.find({});
  res.send({ songs });
};

exports.downloadSong = (req, res) => {
  ytdl('http://www.youtube.com/watch?v=aqz-KE-bpKQ').pipe(fs.createWriteStream('video.mp4'));
};

exports.playSong = async (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.statusCode = 403;
    return res.end();
  }

  const bucketId = mongoose.Types.ObjectId(req.params.bucketId);
  gridFSBucket.find({ _id: bucketId }).toArray((err, files) => {
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

exports.likeSong = (req, res) => {};

exports.updateModel = async (req, res) => {
  const songs = await Song.find({}).populate('artist');
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(songs, null, 2));
};
