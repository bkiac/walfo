const mongoose = require('mongoose');
const cryptocompare = require('../api/cryptocompare');

const Transaction = mongoose.model('Transaction');

exports.getCurrentPrices = async (req, res) => {
  const { user } = req;

  const symbols = await Transaction.getSymbols(user);
  const prices = cryptocompare.collectPriceMultiBatch(
    await cryptocompare.priceMultiBatch(symbols, 'USD'),
  );

  return res.status(200).send(prices);
};
