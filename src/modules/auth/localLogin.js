const {User} = require('../../database/models');
const bcrypt = require('bcryptjs');

const localLogin = async (email, password) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = localLogin;
