/**
 * @name ensureLoggedIn
 * @function
 * @memberof module:Auth
 * @description Checks if the user is logged with a concrete type
 * @param {string} type User's type
 */
const ensureLoggedIn = type => {
  if (!type) {
    throw new Error('The auth type is required');
  }
  const _type = type;

  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === _type) {
      return next(null);
    }
    res.redirect('/not-authorized');
    return null;
  };
};

module.exports = ensureLoggedIn;
