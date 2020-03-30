/**
 * @name sendError
 * @description Returns a 500 response
 * @memberof module:Server
 * @function
 * @param {*} error
 * @param {*} res
 */
const sendError = (error, res) => {
  console.log(error);
  return res.status(500).json({
    message: 'Internal Server Error',
  });
};

module.exports = sendError;
