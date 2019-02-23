const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

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
