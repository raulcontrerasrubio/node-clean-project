/**
 * @module Auth
 */

const logout = require('./logout');
const ensureLoggedIn = require('./ensureLoggedIn');
const localSignup = require('./localSignup');
const localLogin = require('./localLogin');
const sendConfirmationEmail = require('./sendConfirmationEmail');

module.exports = {
  logout,
  ensureLoggedIn,
  localSignup,
  localLogin,
  sendConfirmationEmail,
};
