const router = require('express').Router();

const verifyToken = require('../middleware/verifyToken');
const authCtrl = require('../controllers/auth');

router.get('/invitation/:key', authCtrl.getInvitation);
router.post('/invitation/confirm', authCtrl.confirmInvitation);
router.post('/invitation', verifyToken({ acceptBypass: false }), authCtrl.createInvitation);
router.post('/changePassword', verifyToken({ acceptBypass: true }), authCtrl.changePassword);
router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.get('/identify', authCtrl.identify);

router.get('/setcookie', (req, res) => {
  res
    .cookie('refresh_token', '123456789', {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      signed: true,
    })
    .send({ message: 'nice' });
});
router.get('/getcookie', verifyToken, (req, res) => {
  const h = req.signedCookies;
  res.send(h);
});

module.exports = router;
