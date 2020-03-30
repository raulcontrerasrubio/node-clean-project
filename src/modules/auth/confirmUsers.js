const {v4: uuidv4} = require('uuid');
const {VALID_TYPE_USERS, USER} = require('../../config/config');
const {User} = require('../../database/models');

/**
 * @name confirmUser
 * @function
 * @async
 * @memberof module:Auth
 * @description Confirms an user account
 * @param {string} id User's id
 * @param {string} token User's token
 * @param {string} type User's type
 */
const confirmUser = async (id, token, type) => {
  try {
    if (!id || !token) {
      throw new Error('The id and the token are required');
    }

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

    const result = await Model.update(
      {
        confirmed: true,
        token: uuidv4(),
      },
      {
        where: {
          id,
          token,
          confirmed: false,
        },
      }
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = confirmUser;
