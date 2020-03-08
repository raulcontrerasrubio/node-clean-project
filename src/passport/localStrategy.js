const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../modules/database/models/User');

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
      emailField: 'email',
    },
    async (req, email, password, done) => {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      console.log(user);
      if (!user) {
        return done(null, false, {message: 'The email does not exist.'});
      }

      if (!bcrypt.compareSync(user.password, password)) {
        return done(null, false, {message: 'The password is incorrect.'});
      }

      return done(null, user);
    }
  )
);
