const bcrypt = require('bcryptjs');
const {User} = require('../../database/models');

const localSignup = async (email, password) => {
  try {
    const existsUserWithEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (existsUserWithEmail) {
      return null;
    }

    const parsedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const user = await User.create({
      email: email,
      password: parsedPassword,
    });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = localSignup;
