const router = require('express').Router();

const authRouter = require('./auth');

router.get('/not-authorized', (req, res) => {
  return res.status(403).json({
    message: 'Access denied',
  });
});

router.use('/auth', authRouter);

module.exports = router;
