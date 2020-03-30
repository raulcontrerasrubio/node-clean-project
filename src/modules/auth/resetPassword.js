const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const {User} = require('../../database/models');
const {USER, PASSWORD_SALT} = require('../../config/config');

const resetPassword = async (id, token, password, type) => {
  try {
    if (!id || !token || !password) {
      return false;
    }

    const hashedPassword = bcrypt.hashSync(password, PASSWORD_SALT);

    let idAffected;
    const updatePassword = async Model => {
      return await Model.update(
        {
          password: hashedPassword,
          token: uuidv4(),
        },
        {
          where: {
            id,
            token,
            confirmed: 1,
          },
        }
      );
    };
    switch (type) {
      case USER:
        {
          idAffected = (await updatePassword(User))[0];
        }
        break;
      default:
        throw new Error('The type specified is not valid');
    }

    if (!idAffected) {
      return false;
    }

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = resetPassword;
