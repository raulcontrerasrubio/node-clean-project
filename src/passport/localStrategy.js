const passport = require('passport');
// const connection = require('../mysql'); // Connection to mysql to perform queries
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = {}; // Return a user if the username and password are correct
    return done(null, user);
  })
);
