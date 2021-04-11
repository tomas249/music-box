const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');
// const connectDB = require('./config/db');
const Song = require('./models/Song');
// Download
const youtubedl = require('youtube-dl-exec');
// Search
const search = require('youtube-search');

// Variables
const apikey = 'AIzaSyBSXoS9uS4O7JleclQaVpJbB3loxWEs7zc';
const publicPath = path.join(__dirname, '..', 'public');

// DataBase
// connectDB()

// Middleware
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use('/public', express.static(publicPath));
/**
 * Router
 */

app.get('/download-media/:id/:name', (req, res) => {
  const file = path.join(publicPath, req.params.id + '.mp3');
  res.download(file, req.params.name);
});

app.get('/search/:query', async (req, res) => {
  const query = req.params.query;

  const opts = {
    maxResults: 3,
    key: apikey,
  };

  search(query, opts, (err, results) => {
    if (err) {
      console.error('Search failed: ' + query);
      return res.send([]);
    }
    res.send(results);
  });
});

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const title = req.body.title;
  const author = req.body.author;
  const videoId = req.body.videoId;

  console.log('Downloading video: ' + videoId);

  const videoExists = await Song.exists({ title });
  if (videoExists)
    return res.status(400).send({ success: false, message: 'Video already exists in database' });
  else return res.send({ success: true, data: 'nada tio' });
  const videosUrl = 'https://www.googleapis.com/youtube/v3/videos?';
  fetch(`${videosUrl}key=${apikey}&id=${videoId}&part=contentDetails`)
    .then((ytRes) => ytRes.json())
    .then(async (ytRes) => {
      if (ytRes.items[0].contentDetails.duration === 'P0D')
        return res.send({ success: false, message: 'You cannot download a live streaming video' });

      const song = await Song.create({ title, author });

      youtubedl(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: path.join(publicPath, `${song._id}.%(ext)s`),
      }).then((output) => {
        res.send({ success: true });
      });
    });
});

app.get('/songs', async (req, res) => {
  const songs = await Song.find({});
  res.send({ songs });
});

app.get('/delete', async (req, res) => {
  await Song.deleteMany({});
  res.send({ success: true });
});

const reactBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(reactBuildPath));
// app.get('**', (req, res) => {
//   res.sendFile(path.join(reactBuildPath, 'index.html'));
// });

/***
 *
 * GRID
 *
 *
 */

const DB_CONNECT = 'mongodb://172.17.0.1:27017/music';
const mongoose = require('mongoose');
const Gridfs = require('gridfs-stream');

const conn = mongoose.createConnection(DB_CONNECT);
const gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db);

const writeStream = gridFSBucket.openUploadStream('test.dat');

const db = mongoose.connection.db;
const mongoDriver = mongoose.mongo;
const gfs = new Gridfs('music', mongoDriver);

app.get('/grid', (req, res) => {
  const filepath = path.join(publicPath, '605c20929cd08627291b246b.mp3');
});

app.listen(5000, console.log('Server running!'));

////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load config
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Imports for stream
const ytdl = require('ytdl-core');
const mongoose = require('mongoose');
// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');

// Variables
const apikey = 'AIzaSyBSXoS9uS4O7JleclQaVpJbB3loxWEs7zc';
const publicPath = path.join(__dirname, '..', 'public');

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(publicPath));

/**
 * STREAM mongo
 */

const conn = mongoose.createConnection(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Init gfs
let gridFSBucket;
conn.once('open', () => {
  // Init stream
  // gfs = Grid(conn.db, mongoose.mongo);
  // gfs.collection('uploads');
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'songs' });
});

// First local to DB
// YT to DB

app.get('/download', async (req, res) => {
  const opt = {
    quality: 'highestaudio',
    format: 'audioonly',
  };
  const info = await ytdl.getInfo('VKgmZivh8c8');
  const format = ytdl.chooseFormat(info.formats, opt);
  ytdl
    .downloadFromInfo(info, opt)
    .pipe(gridFSBucket.openUploadStream('some video fom yt'))
    .on('finish', (file) => res.send(format));
});

app.get('/toLocal', (req, res) => {
  gridFSBucket
    .openDownloadStreamByName('ytvideo')
    .pipe(fs.createWriteStream(path.join(publicPath, 'Song')));
});

app.get('/song', async (req, res) => {
  const range = req.headers.range;
  console.log(range);

  if (!range) {
    res.statusCode = 403;
    return res.end();
  }
  const media = await conn.collection('fs.files').findOne({});
  const total = media.length;
  const [partialstart, partialend] = range.replace(/bytes=/, '').split('-');

  const start = parseInt(partialstart, 10);
  const end = partialend ? parseInt(partialend, 10) : total - 1;
  const chunksize = end - start + 1;

  res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Length', chunksize);
  // res.setHeader('Content-Type', 'audio/mpeg');
  res.writeHead(206);
  gridFSBucket.openDownloadStreamByName('ytvideo', { start }).pipe(res);
});

app.listen(5000, console.log('Server running!'));
