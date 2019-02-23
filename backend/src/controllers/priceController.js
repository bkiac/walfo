const mongoose = require('mongoose');
const cryptocompare = require('../api/cryptocompare');

const Transaction = mongoose.model('Transaction');

exports.getCurrentPrices = async (req, res) => {
  const { user } = req;

  const symbols = await Transaction.getAllSymbolsByUserId(user);
  const prices = (await cryptocompare.priceMultiBatch(symbols, 'USD')).reduce((acc, pb) => ({
    ...acc,
    ...pb,
  }));

  return res.status(200).send(prices);
};

exports.getPricesForLastDays = async (req, res) => {
  const { user } = req;
  const { numOfDays } = req.params;

  const symbols = await Transaction.getAllSymbolsByUserId(user);
  const histoDayBatches = await cryptocompare.histoDayBatch(symbols, 'USD', {
    limit: numOfDays,
  });

  const prices = {};
  for (let i = 0; i < histoDayBatches.length; i += 1) {
    prices[symbols[i]] = histoDayBatches[i].map(dpd => ({
      time: new Date(dpd.time * 1000),
      price: (dpd.open + dpd.close) / 2,
    }));
  }

  res.status(200).send(prices);
};
