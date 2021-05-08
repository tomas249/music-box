const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');

const tracksController = require('../controllers/tracks');

router.get('/download/image', tracksController.downloadImage);
router.get('/view/image/:imageId', tracksController.viewImage);
router.get('/search/:query', verifyToken(), tracksController.searchTrack);
router.get('/download/:ytId', verifyToken(), tracksController.downloadTrack);
router.get('/delete/:trackId', tracksController.deleteTrack);
router.get('/play/:bucketId', tracksController.playTrack);
router.get('/like/:trackId', verifyToken(), tracksController.likeTrack);
router.get('/me', verifyToken(), tracksController.getLikedTracks);

module.exports = router;
