const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {User} = require('../database/models');

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    'local',
    new LocalStrategy(async (email, password, done) => {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return done(null, false, {message: 'The email provided does not exist'});
      }

      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      }

      return done(null, false, {message: 'The password is not correct.'});
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      done(new Error('Bad user.'));
    }

    done(null, user);
  });
};
