const logout = (req, type) => {
  if (req.user && req.user.type === type) {
    req.logout();
    return true;
  }
  return false;
};

module.exports = logout;
