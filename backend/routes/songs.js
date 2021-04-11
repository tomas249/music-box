const router = require('express').Router();

const songsController = require('../controllers/songs');

router.get('/search/:query', songsController.searchSong);
router.get('/save/:videoId', songsController.saveSong);
router.get('/play/:bucketId/:songId', songsController.playSong);
router.get('/update/model', songsController.updateModel);
router.get('/', songsController.getSongs);

module.exports = router;
