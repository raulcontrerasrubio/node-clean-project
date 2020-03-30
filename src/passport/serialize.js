const setEntity = require('./setEntity');

const serialize = (entity, done) => {
  done(null, setEntity(entity.id, entity.type));
};

module.exports = serialize;
