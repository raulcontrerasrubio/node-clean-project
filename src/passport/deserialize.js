const {USER} = require('../config/config');
const {User} = require('../database/models');

const deserialize = async (entity, done) => {
  try {
    let account;
    switch (entity.type) {
      case USER:
        account = await User.findOne({
          where: {
            id: entity.id,
          },
        });
        break;
      default:
        throw new Error('The user type is not valid');
    }

    if (!account) {
      done(null, false);
      return null;
    }

    done(null, {data: account, type: entity.type});
    return null;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = deserialize;
