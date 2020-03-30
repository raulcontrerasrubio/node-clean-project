/** Auth routes
 * @module routes
 */

/**
 * @type {object}
 * @description Route /auth
 * @const
 * @namespace /auth
 */
const Auth = require('express').Router();

const isEmail = require('isemail');
const {USER} = require('../config/config');
const setEntity = require('../passport/setEntity');

const auth = require('../modules/auth/index');
const server = require('../modules/server/index');

/**
 * @name Is authenticated?
 * @description Returns if a user is authenticated or not
 * @path {GET} /auth/is-authenticated
 * @memberof module:routes~/auth
 * @code {200} Request success
 * @code {403} Access denied
 * @response {Object} 200: req.user
 * @response {Object} 403:
 * @response {string} message Error message
 */
Auth.get('/is-authenticated', auth.ensureLoggedIn(USER), (req, res) => {
  res.status(200).json(req.user);
});

Auth.get('/logout', (req, res) => {
  const loggedOut = auth.logout(req, USER);
  if (loggedOut) {
    return res.status(200).json({
      message: 'Logged out successfully',
    });
  }
  return res.status(200).json({
    message: 'The account was not logged',
  });
});

Auth.post('/confirm', async (req, res) => {
  try {
    const {id, token} = req.body;

    if (!id || !token) {
      return res.status(400).json({
        message: 'The id and the token are required',
      });
    }

    const user = await auth.confirmUser(id, token, USER);

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    const entity = setEntity(id, USER);

    return req.login(entity, error => {
      if (error) {
        throw new Error(error);
      }

      return res.status(200).json(entity);
    });
  } catch (error) {
    return server.sendError(error, res);
  }
});

Auth.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await auth.localLogin(email, password, USER);

    if (!user) {
      return res.status(400).json({
        message: 'Wrong credentials',
      });
    }

    if (!user.confirmed) {
      return res.status(400).json({
        message: 'The account is not activated',
      });
    }
    const entity = setEntity(user.id, USER);

    return req.login(entity, error => {
      if (error) {
        throw new Error(error);
      }

      return res.status(200).json(entity);
    });
  } catch (error) {
    return server.sendError(error, res);
  }
});

Auth.post('/signup', async (req, res) => {
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
    const additionalInfo = {
      SKIP_CONFIRMATION_EMAIL: process.env.SKIP_CONFIRMATION_EMAIL,
    };

    const user = await auth.localSignup(email, password, additionalInfo, USER);

    if (!user) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    const entity = setEntity(user.id, USER);

    if (!+process.env.REQUIRE_EMAIL_CONFIRMATION) {
      return req.login(entity, error => {
        if (error) {
          server.sendError(error, res);
        }

        return res.status(200).json(entity);
      });
    }

    return res.status(200).json(entity);
  } catch (error) {
    return server.sendError(error, res);
  }
});

Auth.post('/send-recovery-email', async (req, res) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'The email is required',
      });
    }

    const parsedEmail = email.trim();
    if (!isEmail.validate(parsedEmail)) {
      return res.status(400).json({
        message: 'The email is not valid',
      });
    }

    const options = {
      SKIP_RESET_PASSWORD_EMAIL: process.env.SKIP_RESET_PASSWORD_EMAIL,
    };
    const sended = await auth.sendPasswordRecoveryEmail(parsedEmail, USER, options);

    if (!sended) {
      return res.status(400).json({
        message: 'The email does not exist',
      });
    }

    return res.status(200).json({
      messsage: 'Email sent successfully',
    });
  } catch (error) {
    return server.sendError(error, res);
  }
});

Auth.post('/reset-password', async (req, res) => {
  try {
    const {id, token, password, confirmPassword} = req.body;

    if (!id || !token || !password || !confirmPassword || password !== confirmPassword) {
      return res.status(400).json({
        message:
          'The id, the token, the password and the confirmation of the password are required. Also, the password and the confirmation of the password must be the same',
      });
    }

    const isReset = await auth.resetPassword(id, token, password, USER);

    if (!isReset) {
      return res.status(400).json({
        message: 'The token is not correct or the user does not exist',
      });
    }

    return res.status(200).json({
      message: 'Reseted password successfully',
    });
  } catch (error) {
    return server.sendError(error, res);
  }
});

module.exports = Auth;
