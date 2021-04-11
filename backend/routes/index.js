const router = require('express').Router();
const errorHandler = require('../middleware/error');
const verifyToken = require('../middleware/verifyToken');

const authRoute = require('./auth');
// const usersRoute = require('./users');
const songsRoute = require('./songs');

router.use('/auth', authRoute);
// router.use('/users', usersRoute);
router.use('/songs', songsRoute);
router.use(errorHandler);

module.exports = router;
