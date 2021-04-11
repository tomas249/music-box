const router = require('express').Router();

const usersController = require('../controllers/users');

router.post('/tokens/createInvitation', usersController.createInvitation);
router.post('/createAccount', usersController.createAccount);
router.get('/firstLogin/:accessKey', usersController.firstLogin);
router.get('/authorize');
module.exports = router;
