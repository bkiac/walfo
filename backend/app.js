const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressValidator = require('express-validator');

const customValidators = require('./src/utils/customValidators');

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

// Pass variables all requests
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// Import models
require('./src/models/User');
require('./src/models/Transaction');
require('./src/models/Tags');

// Import configs
require('./src/config/passport');

// After the middleware, we handle our own routes
app.use('/api', require('./src/routes/index'));

// done!
module.exports = app;
