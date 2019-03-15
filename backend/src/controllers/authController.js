const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  await User.create({ email, password });

  next(); // pass to authController.login
};

exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).send({ message: 'Authentication failure' });
    }

    return req.login(user, { session: false }, async loginErr => {
      if (loginErr) {
        return next(loginErr);
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.status(200).send({ email: user.email, token });
    });
  })(req, res);
};

exports.protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};
