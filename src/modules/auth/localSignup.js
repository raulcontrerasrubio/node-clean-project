const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');
const {VALID_TYPE_USERS, USER, PASSWORD_SALT} = require('../../config/config');
const {User} = require('../../database/models');
const sendConfirmationEmail = require('./sendConfirmationEmail');

const localSignup = async (email, password, additionalInfo, type) => {
  try {
    if (!VALID_TYPE_USERS.includes(type)) {
      throw new Error('The user type is not valid');
    }

    let Model;
    switch (type) {
      case USER:
        Model = User;
        break;
      default:
        throw new Error('The user type is not valid');
    }

    const existsAccountWithEmail = await Model.findOne({
      where: {
        email,
      },
    });

    if (existsAccountWithEmail) {
      return null;
    }

    const parsedPassword = bcrypt.hashSync(password, PASSWORD_SALT);
    const token = uuidv4();

    let account;
    switch (type) {
      case USER:
        {
          account = await User.create({
            email,
            password: parsedPassword,
            token,
            confirmed: !+process.env.REQUIRE_EMAIL_CONFIRMATION,
          });
        }
        break;
      default:
        throw new Error('The user type is not valid');
    }

    if (+process.env.REQUIRE_EMAIL_CONFIRMATION) {
      await sendConfirmationEmail(email, type, account.id, token, additionalInfo.SKIP_CONFIRMATION_EMAIL);
    }

    return account;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = localSignup;
