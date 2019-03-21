const cryptocompare = require('../api/cryptocompare');

exports.getCoinList = async (req, res) => {
  const coinList = await cryptocompare.coinList();
  return res.status(200).send(coinList.Data);
};
