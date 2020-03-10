const sendError = (error, res) => {
  console.log(error);
  res.status(500).json({
    message: 'Internal Server Error',
  });
  return null;
};

module.exports = sendError;
