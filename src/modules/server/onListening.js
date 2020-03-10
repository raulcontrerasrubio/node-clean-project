const onListening = (server, sequelize) => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  sequelize
    .authenticate()
    .then(() => {
      console.log('MySQL connection successfull.');
    })
    .catch(err => {
      console.error('MySQL connection error:', err);
    });
};

module.exports = onListening;
