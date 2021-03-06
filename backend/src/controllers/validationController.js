const mongoose = require('mongoose');
const { body, param, query, validationResult } = require('express-validator/check');
const { sanitizeQuery } = require('express-validator/filter');
const cryptocompare = require('../api/cryptocompare');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');

exports.transactionValidators = [
  body('date').isISO8601(),
  body('amount').isNumeric(),
  body('price').isNumeric(),
  body('type').custom(value => value === 'BUY' || value === 'SELL'),
  body('tags').isArray(),
  body('tags.*').isString(),
];

exports.createTransactionValidators = [
  ...exports.transactionValidators,
  body('symbol')
    .isString()
    .custom(async value => cryptocompare.price(value, 'USD')),
  body('portfolio')
    .isString()
    .not()
    .isEmpty()
    .trim(),
];

exports.updateTransactionsValidators = [
  ...exports.transactionValidators,
  param('id')
    .isMongoId()
    .custom(async (id, { req }) => {
      const tx = await Transaction.findOne({ _id: id });
      return tx && tx.user.equals(req.user);
    }),
  body('portfolio')
    .not()
    .exists(),
  body('symbol')
    .not()
    .exists(),
];

exports.deleteTransactionValidators = [
  param('id')
    .isMongoId()
    .custom(async (id, { req }) => {
      const tx = await Transaction.findOne({ _id: id });
      return tx && tx.user.equals(req.user);
    }),
];

exports.getPortfolioDataValidators = [
  param('portfolio').custom(async (portfolio, { req }) =>
    Transaction.findOne({ user: req.user, portfolio }),
  ),
  query('tags')
    .optional()
    .isString(),
  sanitizeQuery('tags').customSanitizer(tags => tags.split(',')),
];

exports.getHistoricalPortfolioValidators = [
  ...exports.getPortfolioDataValidators,
  query('date')
    .isISO8601()
    .custom(async (date, { req }) => {
      const symbols = await Transaction.getSymbols(req.user, req.params.portfolio, date);
      return symbols.length > 0;
    }),
];

exports.passwordValidators = [
  body('password').exists(),
  body('confirmPassword')
    .exists()
    .custom((value, { req }) => value === req.body.password),
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
  ...exports.passwordValidators,
];

exports.changePasswordValidators = [...exports.passwordValidators];

exports.validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  return next();
};
