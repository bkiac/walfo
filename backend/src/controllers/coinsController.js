const moment = require('moment');
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

  try {
    const coins = await cryptocompare.priceFull(symbols, 'USD');
    const coinsWithInfoAndMarketData = Object.entries(coins).map(([symbol, marketData]) => ({
      info: coinList[symbol],
      marketData: marketData.USD,
    }));
    return res.status(200).send(coinsWithInfoAndMarketData);
  } catch (err) {
    return res.status(422).send(err.toString());
  }
};

exports.getHistoricalPriceDataForCoinBetweenDates = async (req, res) => {
  const { symbol, startDate, endDate } = req.query;

  const startMoment = moment(startDate).endOf('day');
  const endMoment = moment(endDate).endOf('day');
  const numOfDays = Math.floor(moment.duration(endMoment.diff(startMoment)).asDays());

  try {
    const priceData = await cryptocompare.histoDay(symbol, 'USD', {
      limit: numOfDays,
      timestamp: endMoment.toDate(),
    });

    const prices = priceData.map(({ time, high, low, volumeto }) => ({
      date: moment(time * 1000),
      price: (high + low) / 2,
      volume: volumeto,
    }));

    return res.status(200).send(prices);
  } catch (err) {
    return res.status(422).send(err.toString());
  }
};
