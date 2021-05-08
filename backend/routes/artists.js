const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');

const artistsController = require('../controllers/artists');

router.get('/me', verifyToken(), artistsController.getUserArtists);
router.get('/follow/:artistId', verifyToken(), artistsController.followArtist);
router.get('/:artistId', verifyToken(), artistsController.getArtistById);

module.exports = router;
