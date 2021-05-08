const router = require('express').Router();
const errorHandler = require('../middleware/error');
const verifyToken = require('../middleware/verifyToken');

const authRoute = require('./auth');
// const usersRoute = require('./users');
const tracksRoute = require('./tracks');
const playlistsRoute = require('./playlists');
const artistsRoute = require('./artists');

router.use('/auth', authRoute);
// router.use('/users', usersRoute);
router.use('/tracks', tracksRoute);
router.use('/playlists', playlistsRoute);
router.use('/artists', artistsRoute);
router.use(errorHandler);

module.exports = router;
