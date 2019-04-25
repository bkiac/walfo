const cryptocompare = require('../api/cryptocompare');

exports.getCoinList = async (req, res) => {
  const coinList = await cryptocompare.coinList();
  return res.status(200).send(coinList.Data);
};

exports.getTopCoinsByVolume = async (req, res) => {
  const { Data: coins } = await cryptocompare.topCoinsByVolume();
  const parsedCoins = coins.map(c => ({
    info: c.CoinInfo,
    marketData: c.RAW.USD,
  }));
  return res.status(200).send(parsedCoins);
};

exports.getTopCoinsByMarketCap = async (req, res) => {
  const { Data: coins } = await cryptocompare.topCoinsByMarketCap();
  const parsedCoins = coins.map(c => ({
    info: c.CoinInfo,
    marketData: c.RAW.USD,
  }));
  return res.status(200).send(parsedCoins);
};

exports.getFullMarketDataForCoins = async (req, res) => {
  const { symbols } = req.query;
  const { Data: coinList } = await cryptocompare.coinList();
  const coins = await cryptocompare.priceFull(symbols, 'USD');
  const coinsWithInfoAndMarketData = Object.entries(coins).map(([symbol, marketData]) => ({
    info: coinList[symbol],
    marketData: marketData.USD,
  }));
  return res.status(200).send(coinsWithInfoAndMarketData);
};
