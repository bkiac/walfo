const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressValidator = require('express-validator');
const routes = require('./routes/index');

// Creates the Express app
const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Exposes methods used for data validation.
app.use(expressValidator());

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

// After the middleware, we handle our own routes
app.use('/', routes);

// done!
module.exports = app;
