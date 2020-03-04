#!/usr/bin/env node

require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
require('debug')('tarjeat-server:server');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const onListening = require('./modules/server/onListening');
const onError = require('./modules/server/onError');
const normalizePort = require('./modules/server/normalizePort');

const indexRouter = require('./routes/index');

const app = express();

/**
 * MIDDLEWARES
 */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
server.on('error', onError);
server.on('listening', () => onListening(server));

module.exports = app;
