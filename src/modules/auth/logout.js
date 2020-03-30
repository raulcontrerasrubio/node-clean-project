/**
 * @name logout
 * @function
 * @memberof module:Auth
 * @description Closes the user session
 * @param {Object} req Express req object
 * @param {string} type User type
 */
const logout = (req, type) => {
  if (req.user && req.user.type === type) {
    req.logout();
    return true;
  }
  return false;
};

module.exports = logout;
