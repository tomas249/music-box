const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');

const playlistsController = require('../controllers/playlists');

router.post('/create', verifyToken(), playlistsController.createPlaylist);
router.get('/me', verifyToken(), playlistsController.getUserPlaylists);
router.get('/:id', verifyToken(), playlistsController.getPlaylistById);
router.post('/add/track', verifyToken(), playlistsController.addToPlaylist);
router.post('/remove/track', verifyToken(), playlistsController.removeFromPlaylist);

module.exports = router;
