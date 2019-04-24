const cryptocompare = require('../api/cryptocompare');

exports.getCoinList = async (req, res) => {
  const coinList = await cryptocompare.coinList();
  return res.status(200).send(coinList.Data);
};

exports.getTopCoinsByVolume = async (req, res) => {
  const coins = await cryptocompare.topCoinsByVolume();
  return res.status(200).send(coins.Data);
};

exports.getTopCoinsByMarketCap = async (req, res) => {
  const coins = await cryptocompare.topCoinsByMarketCap();
  return res.status(200).send(coins.Data);
};
