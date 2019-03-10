const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Transaction = mongoose.model('Transaction');

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

      const portfolios = await Transaction.getPortfolios(user._id);
      const userObject = {
        id: user._id,
        email: user.email,
        portfolios,
      };

      const token = jwt.sign(userObject, process.env.JWT_SECRET);
      return res.status(200).send({ user: userObject, token });
    });
  })(req, res);
};

exports.protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};
