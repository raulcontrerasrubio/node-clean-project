const express = require('express');
const router = express.Router();
const isEmail = require('isemail');

const auth = require('../modules/auth/index');
const server = require('../modules/server/index');

router.get('/isAuthenticated', auth.ensureLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/logout', (req, res) => {
  auth.logout(req);
  return res.status(200).json({
    message: 'Logged out successfully',
  });
});

router.get('/not-authorized', (req, res) => {
  return res.status(403).json({
    message: 'Access denied',
  });
});

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await auth.localLogin(email, password);

    if (!user) {
      return res.status(400).json({
        message: 'Wrong credentials',
      });
    }

    return req.login(user, error => {
      if (error) {
        throw new Error(error);
      }

      return res.status(200).json(user);
    });
  } catch (error) {
    return server.sendError(error, res);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'The email and the password are required',
      });
    }
    const parsedEmail = email.trim();

    if (!isEmail.validate(parsedEmail)) {
      return res.status(400).json({
        message: 'The email is not valid',
      });
    }

    const user = await auth.localSignup(email, password);

    if (!user) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    return req.login(user, error => {
      if (error) {
        throw new Error(error);
      }

      return res.status(200).json(user);
    });
  } catch (error) {
    return server.sendError(error, res);
  }
});

module.exports = router;
