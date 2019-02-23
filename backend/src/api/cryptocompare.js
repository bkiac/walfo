const cryptocompare = require('cryptocompare');
const helpers = require('../utils/helpers');

cryptocompare.setApiKey(process.env.API_KEY);

cryptocompare.priceMultiBatch = (fsyms, tsyms, options) => {
  const symbolChunks = helpers.chunk(fsyms, 300);
  const prices = symbolChunks.map(sch => cryptocompare.priceMulti(sch, tsyms, options));
  return Promise.all(prices);
};

cryptocompare.histoDayBatch = (fsyms, tsym, options) => {
  const histos = fsyms.map(fsym => cryptocompare.histoDay(fsym, tsym, options));
  return Promise.all(histos);
};

module.exports = cryptocompare;
