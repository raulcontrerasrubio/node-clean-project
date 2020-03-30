/**
 * @module routes
 * @namespace /
 */
const router = require('express').Router();

const authRouter = require('./auth');

/**
 * @name Access denied
 * @description Indicates that the access is denied
 * @memberof module:routes./
 * @path {GET} /not-authorized
 * @code {403} Access denied
 * @response {Object} 403:
 * @response {string} message Response message
 */
router.get('/not-authorized', (req, res) => {
  return res.status(403).json({
    message: 'Access denied',
  });
});

router.use('/auth', authRouter);

module.exports = router;
