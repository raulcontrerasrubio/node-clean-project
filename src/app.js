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
const flash = require('connect-flash');

const bodyParser = require('body-parser');
const cors = require('cors');
const {CORS_OPTIONS, HEADERS_CONFIG, SESSION_MIDDLEWARE} = require('./config/config');

const onListening = require('./modules/server/onListening');
const onError = require('./modules/server/onError');
const normalizePort = require('./modules/server/normalizePort');

const indexRouter = require('./routes/index');

const app = express();
require('./passport/index')(app);

/**
 * MIDDLEWARES
 */
app.use(cors(CORS_OPTIONS));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(HEADERS_CONFIG);
app.use(SESSION_MIDDLEWARE);
app.use(flash());
require('./passport')(app);

/**
 * ROUTES
 */

app.use('/', indexRouter);

/**
 * ERROR HANDLING
 */

app.use((req, res) => {
  res.status(req.status || 404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname + '/public/404.html'));
    return;
  }

  if (req.accepts('json')) {
    res.json({
      code: 404,
      message: 'Page not found',
    });
  }

  res.type('txt').send('Page not found');
});

app.use((error, req, res) => {
  console.log(error);
  res.status(req.status || 500);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname + '/public/500.html'));
    return;
  }

  if (req.accepts('json')) {
    res.json({
      code: 500,
      message: 'Internal Server Error',
    });
  }

  res.type('txt').send('Internal Server Error');
});

/**
 * SERVER CREATION
 */

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', error => onError(error, port));
server.on('listening', () => onListening(server));

module.exports = app;
