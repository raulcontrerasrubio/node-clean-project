const express = require('express');
const router = express.Router();
const auth = require('../modules/auth/index');

/* GET home page. */
router.get('/', auth.ensureLoggedIn, (req, res) => {
  res.status(200).json({working: true});
});

module.exports = router;
