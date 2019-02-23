const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator/check');
const cryptocompare = require('../api/cryptocompare');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');

exports.addTransactionValidators = [
  body('portfolio')
    .isString()
    .trim(),
  body('symbol').custom(async value => cryptocompare.price(value, 'USD')),
  body('date').isISO8601(),
  body('amount').isNumeric(),
  body('price').isNumeric(),
  body('type').custom(value => value === 'BUY' || value === 'SELL'),
];

exports.getPortfolioDataValidators = [
  param('portfolio').custom(async (portfolio, { req }) =>
    Transaction.findOne({ user: req.user, portfolio }),
  ),
];

exports.registerValidators = [
  body('email')
    .isEmail()
    .normalizeEmail({
      gmail_remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false,
    })
    .custom(async value => {
      const user = await User.findOne({ email: value });
      return user === null;
    }),
  body('password').exists(),
  body('confirmPassword')
    .exists()
    .custom((value, { req }) => value === req.body.password),
];

exports.getPricesForLastDaysValidators = [param('numOfDays').isInt({ min: 1, max: 2000 })];

exports.validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  return next();
};
