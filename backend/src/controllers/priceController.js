const cryptocompare = require('cryptocompare');

cryptocompare.setApiKey(process.env.API_KEY);

exports.listCoins = async (req, res) => {
  const list = await cryptocompare.coinList();
  return res.status(200).send(list);
};
