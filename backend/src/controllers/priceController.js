const mongoose = require('mongoose');
const cryptocompare = require('../api/cryptocompare');
const helpers = require('../utils/helpers');

const Transaction = mongoose.model('Transaction');

exports.getCurrentPrices = async (req, res) => {
  const { user } = req;

  const symbolChunks = helpers.chunk(await Transaction.getAllSymbolsByUserId(user));
  const priceChunks = await Promise.all(
    symbolChunks.map((ch) => cryptocompare.priceMulti(ch, 'USD')),
  );
  const prices = priceChunks.reduce((accumulator, ch) => ({
    ...accumulator,
    ...ch,
  }));

  return res.status(200).send(prices);
};

exports.getPricesForLastDays = async (req, res) => {
  const { user } = req;
  const { numOfDays } = req.params;

  const symbols = await Transaction.getAllSymbolsByUserId(user);
  const dailyPriceData = await Promise.all(
    symbols.map((s) =>
      cryptocompare.histoDay(s, 'USD', {
        limit: numOfDays,
      }),
    ),
  );

  const prices = {};
  for (let i = 0; i < dailyPriceData.length; i += 1) {
    prices[symbols[i]] = dailyPriceData[i].map((dpd) => ({
      time: new Date(dpd.time * 1000),
      price: (dpd.open + dpd.close) / 2,
    }));
  }

  res.status(200).send(prices);
};
