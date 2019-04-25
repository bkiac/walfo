const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressValidator = require('express-validator');
const path = require('path');
const cors = require('cors');

// Creates the Express app
const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Exposes methods used for data validation.
app.use(expressValidator());

// Passport for login
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(cors({ credentials: true, origin: true }));

// Serve public files
app.use(express.static('public'));

// Import models
require('./models/User');
require('./models/Transaction');
require('./models/Tags');

// Import configs
require('./config/passport');

// Routes
app.use('/api', require('./routes'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

// Handle invalid routes
app.use((req, res, next) => {
  const err = new Error('Not found');
  res.status(404);
  next(err);
});

// Catch errors
app.use((err, req, res) => {
  res.locals.mesage = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  console.log(err.toString());

  return res.status(res.statusCode || 500).send(err.toString());
});

// Catch Unhandled Promise Rejections
process.on('unhandledRejection', err => {
  console.error('Caught UnhandledPromiseRejection:', err.toString());
});

// done!
module.exports = app;
