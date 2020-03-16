const user = require('express').Router();

const authRouter = require('./auth');

user.use('/auth', authRouter);

module.exports = user;
