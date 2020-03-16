const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {User} = require('../database/models');
const {USER} = require('../config/config');

const userStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return done(null, false);
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false);
      }

      return done(null, {id: user.id, type: USER});
    } catch (error) {
      throw new Error(error);
    }
  }
);

module.exports = {
  userStrategy,
};
