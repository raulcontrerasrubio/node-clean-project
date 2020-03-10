const ensureLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(null);
  }
  res.redirect('/auth/not-authorized');
};

module.exports = ensureLoggedIn;
