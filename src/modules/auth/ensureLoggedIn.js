const ensureLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(null);
  }
  res.redirect('/auth/not-authorized');
  return null;
};

module.exports = ensureLoggedIn;
