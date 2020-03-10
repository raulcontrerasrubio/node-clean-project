const CORS_OPTIONS = {
  origin: true,
  credentials: true,
};

const HEADERS_CONFIG = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
};

module.exports = {
  CORS_OPTIONS,
  HEADERS_CONFIG,
};
