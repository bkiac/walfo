const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.validateTransaction = (req, res, next) => {
  req
    .checkBody('portfolio', 'No portfolio')
    .notEmpty()
    .isString();
  req.checkBody('symbol', 'No symbol').notEmpty(); // @todo: Check valid symbols
  req
    .checkBody('date', 'No date')
    .notEmpty()
    .isISO8601();
  req
    .checkBody('amount', 'No amount')
    .notEmpty()
    .isNumeric();
  req
    .checkBody('price', 'No price')
    .notEmpty()
    .isNumeric();
  req
    .checkBody('type', 'No type')
    .notEmpty()
    .isValidTxType();

  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).send(errors);
  }

  return next();
};

exports.createTransaction = async (req, res) => {
  const { user } = req;
  const { portfolio, symbol, date, amount, price, type, exchange, tags } = req.body;

  await Transaction.create({
    user,
    portfolio,
    symbol,
    date,
    amount,
    price,
    type,
    exchange,
    tags,
  });

  res.status(201).send('New transaction added!');
};
