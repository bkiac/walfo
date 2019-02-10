const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.validateTransaction = (req, res, next) => {
  req
    .checkBody('user', 'No user')
    .notEmpty()
    .isMongoId();
  req
    .checkBody('portfolioName', 'No portfolio')
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
    .checkBody('pricePerAmount', 'No price')
    .notEmpty()
    .isNumeric();
  req
    .checkBody('type', 'No type')
    .notEmpty()
    .isValidTxType();

  const errors = req.validationErrors();
  if (errors) {
    res.status(422).send(errors);
    return;
  }

  next();
};

exports.createTransaction = async (req, res) => {
  const {
    user,
    portfolioName,
    symbol,
    date,
    amount,
    pricePerAmount,
    type,
    exchange,
    tags,
  } = req.body;
  await Transaction.create({
    user,
    portfolioName,
    symbol,
    date,
    amount,
    pricePerAmount,
    type,
    exchange,
    tags,
  });

  res.status(201).send('New transaction added!');
};
