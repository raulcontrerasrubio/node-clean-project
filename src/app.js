#!/usr/bin/env node

require('dotenv-extended').load({
  errorOnMissing: true,
});
const path = require('path');
const http = require('http');
const express = require('express');
require('debug')('node-clean-project:server');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);

const bodyParser = require('body-parser');
const cors = require('cors');
const {CORS_OPTIONS, HEADERS_CONFIG} = require('./config/config');
const passport = require('passport');
const {userStrategy} = require('./passport/strategies');
const deserialize = require('./passport/deserialize');
const serialize = require('./passport/serialize');

const onListening = require('./modules/server/onListening');
const onError = require('./modules/server/onError');
const normalizePort = require('./modules/server/normalizePort');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();
const models = require('./database/models');
const sequelizeSessionStore = new SessionStore({
  db: models.sequelize,
});

/**
 * MIDDLEWARES
 */

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(HEADERS_CONFIG);
app.use(
  session({
    secret: 'Super.node secret-session',
    resave: false,
    saveUninitialized: false,
    store: sequelizeSessionStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);
passport.use('user-local', userStrategy);

/**
 * ROUTES
 */

app.use('/', indexRouter);
app.use('/auth', authRouter);

/**
 * ERROR HANDLING
 */

app.use((req, res) => {
  res.status(req.status || 404);
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname + '/public/404.html'));
  }

  if (req.accepts('json')) {
    return res.json({
      code: 404,
      message: 'Page not found',
    });
  }

  return res.type('txt').send('Page not found');
});

app.use((error, req, res) => {
  console.log(error);
  res.status(req.status || 500);
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname + '/public/500.html'));
  }

  if (req.accepts('json')) {
    return res.json({
      code: 500,
      message: 'Internal Server Error',
    });
  }

  return res.type('txt').send('Internal Server Error');
});

/**
 * SERVER CREATION
 */

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', error => onError(error, port));
server.on('listening', () => onListening(server, models.sequelize));

module.exports = app;
