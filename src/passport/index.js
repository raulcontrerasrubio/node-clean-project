const passport = require('passport');

require('./serializers');
require('./localStrategy');

module.exports = app => {
  app.use(passport.initialize());
  app.use(
    passport.session({
      secret: 'my-web-app-secret',
      name: 'web-app-session-name',
      proxy: true,
      resave: true,
      saveUninitialized: true,
    })
  );
};
