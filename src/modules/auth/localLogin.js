const bcrypt = require('bcryptjs');
const {VALID_TYPE_USERS, USER} = require('../../config/config');
const {User} = require('../../database/models');

/**
 * @name localLogin
 * @function
 * @async
 * @memberof module:Auth
 * @description Initializes a user's session
 * @param {string} email User's email
 * @param {string} password User's password
 * @param {string} type User's type
 */
const localLogin = async (email, password, type) => {
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

    const account = await Model.findOne({
      where: {
        email,
      },
    });

    if (!account) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, account.password);

    if (!isPasswordValid) {
      return null;
    }

    return account;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = localLogin;
