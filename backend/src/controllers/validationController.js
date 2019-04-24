const mongoose = require('mongoose');
const { body, param, query, validationResult } = require('express-validator/check');
const { sanitizeQuery } = require('express-validator/filter');
const cryptocompare = require('../api/cryptocompare');

const User = mongoose.model('User');
const Transaction = mongoose.model('Transaction');

exports.createTransactionValidators = [
  body('portfolio')
    .isString()
    .not()
    .isEmpty()
    .trim(),
  body('symbol')
    .isString()
    .custom(async value => cryptocompare.price(value, 'USD')),
  body('date').isISO8601(),
  body('amount')
    .isNumeric()
    .custom(async (amount, { req: { user, body: { type, portfolio, symbol } } }) => {
      if (type === 'SELL') {
        const txs = await Transaction.find({ user, portfolio, symbol });
        const holdingsForPosition = txs.reduce((h, t) => h + t.amount, 0);
        return amount <= holdingsForPosition;
      }
      return true;
    }),
  body('price').isNumeric(),
  body('type').custom(value => value === 'BUY' || value === 'SELL'),
  body('exchange')
    .optional()
    .isString(),
  body('tags').isArray(),
  body('tags.*').isString(),
];

exports.updateTransactionsValidators = [
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
  body('date').isISO8601(),
  body('amount')
    .isNumeric()
    .custom(async (amount, { req: { user, body: { type, portfolio, symbol } } }) => {
      if (type === 'SELL') {
        const txs = await Transaction.find({ user, portfolio, symbol });
        const holdingsForPosition = txs.reduce((h, t) => h + t.amount, 0);
        return amount <= holdingsForPosition;
      }
      return true;
    })
    .custom(async (amount, { req: { user, body: { type, portfolio, symbol } } }) => {
      if (type === 'BUY') {
        const txs = await Transaction.find({ user, portfolio, symbol, type });
        const soldHoldings = txs.reduce((h, t) => h + t.amount, 0);
        return amount >= soldHoldings;
      }
      return true;
    }),
  body('price').isNumeric(),
  body('type')
    .not()
    .exists(),
  body('exchange')
    .optional()
    .isString(),
  body('tags').isArray(),
  body('tags.*').isString(),
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

exports.validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  return next();
};
