const bcrypt = require('bcryptjs');
const {User} = require('../../database/models');
const {v4: uuidv4} = require('uuid');
const sendConfirmationEmail = require('./sendConfirmationEmail');

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
    const token = uuidv4();

    const user = await User.create({
      email,
      password: parsedPassword,
      token,
      confirmed: !+process.env.REQUIRE_EMAIL_CONFIRMATION,
    });

    if (+process.env.REQUIRE_EMAIL_CONFIRMATION) {
      await sendConfirmationEmail(email, token);
    }

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = localSignup;
