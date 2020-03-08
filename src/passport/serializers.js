const passport = require('passport');
// const connection = require('../mysql'); // Connection to MySQL to perform a query

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(serializeUser, done) {
  // serializeUser.userId
  // Return all data of a user to be stored on req.user
  // MOCK IMPLEMENTATION
  const user = {
    id: serializeUser.userId,
  };
  // END MOCK IMPLEMENTATION
  done(null, user);
});
