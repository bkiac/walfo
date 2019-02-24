const mongoose = require('mongoose');
const cryptocompare = require('../api/cryptocompare');

const Transaction = mongoose.model('Transaction');

exports.getCurrentPrices = async (req, res) => {
  const { user } = req;

  const symbols = await Transaction.getSymbols(user);
  const prices = (await cryptocompare.priceMultiBatch(symbols, 'USD')).reduce((acc, pb) => ({
    ...acc,
    ...pb,
  }));

  return res.status(200).send(prices);
};
