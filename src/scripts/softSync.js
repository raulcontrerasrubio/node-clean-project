#!/usr/bin/env node

const models = require('../database/models');

console.log('Creating tables...');

models.sequelize
  .sync()
  .then(() => {
    console.log('Tables created successfully');
    process.exit();
  })
  .catch(error => {
    console.log(error);
    process.exit();
  });
