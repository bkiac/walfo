const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressValidator = require('express-validator');

const customValidators = require('./utils/customValidators');

// Creates the Express app
const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Exposes methods used for data validation.
app.use(expressValidator({ customValidators }));

// Populate `req.cookies` with any cookies that came along with the request
// app.use(cookieParser());

// Passport for login
app.use(passport.initialize());
app.use(passport.session());

// Import models
require('./models/User');
require('./models/Transaction');
require('./models/Tags');

// Import configs
require('./config/passport');

// After the middleware, we handle our own routes
app.use('/api', require('./routes'));

// Handle invalid routes
app.use((req, res, next) => {
  const err = new Error('Not found');
  res.status(404);
  next(err);
});

// Catch errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.mesage = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  console.log(err.toString());

  return res.status(res.statusCode || 500).send(err.toString());
});

// done!
module.exports = app;
