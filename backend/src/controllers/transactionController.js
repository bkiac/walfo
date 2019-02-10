const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.validateTransaction = (req, res, next) => {
  req
    .checkBody('user', 'No user')
    .notEmpty()
    .isMongoId();
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
    res.status(422).send(errors);
    return;
  }

  next();
};

exports.createTransaction = async (req, res) => {
  const { user, portfolio, symbol, date, amount, price, type, exchange, tags } = req.body;
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

exports.getPortfolioData = async (req, res) => {
  const { user, portfolio } = req.body;
  const positions = await Transaction.getPositionsByUserAndPortfolio(user, portfolio);
  // @todo: Get current price data from API for the present symbols
  // Set position.value.current = ...

  const portfolioBaseValue = positions
    .map((p) => p.value.base)
    .reduce((total, baseValue) => total + baseValue);
  // @todo: Collect current value after API call
  // const portfolioCurrentValue = positions.reduce((p) => p.value.current);

  const portfolioData = {
    value: {
      base: portfolioBaseValue,
      current: 'TODO',
    },
    positions,
  };
  res.status(200).send(portfolioData);
};
