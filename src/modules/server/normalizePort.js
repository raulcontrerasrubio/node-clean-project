/**
 * @name normalizePort
 * @description Returns a normalized port
 * @memberof module:Server
 * @function
 * @param {string} val Value to normalize
 * @returns {number|boolean} Normalized port or false if val is not a valid number
 */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

module.exports = normalizePort;
