const mongoose = require('mongoose');
const cryptocompare = require('cryptocompare');

const Transaction = mongoose.model('Transaction');

exports.getPortfolioNames = async (req, res) => {
  const { user } = req;
  const portfolioNames = await Transaction.getPortfoliosByUserId(user);
  res.status(200).send(portfolioNames);
};

exports.getBasePortfolioData = async (req, res) => {
  const { user } = req;
  const { portfolio } = req.params;
  const positions = await Transaction.getPositionsByUserIdAndPortfolio(user, portfolio);

  let portfolioValue = 0;
  let positionsBySymbol = {};
  positions.forEach((p, i) => {
    portfolioValue += p.avgCost * p.totalHoldings;
    positionsBySymbol = {
      ...positionsBySymbol,
      [positions[i]._id]: positions[i],
    };
  });

  res.status(200).send({ value: portfolioValue, positions: positionsBySymbol });
};

exports.getPortfolioDataWithPrices = async (req, res) => {
  const { user } = req;
  const { portfolio } = req.params;

  const symbols = await Transaction.getAllSymbolsByUserId(user);
  const positions = await Transaction.getPositionsByUserIdAndPortfolio(user, portfolio);
  const prices = (await cryptocompare.priceMultiBatch(symbols, 'USD')).reduce((acc, pb) => ({
    ...acc,
    ...pb,
  }));

  let baseValue = 0;
  let currentValue = 0;
  let positionsBySymbol = {};
  positions.forEach((p, i) => {
    baseValue += p.avgCost * p.totalHoldings;
    currentValue += prices[p._id].USD * p.totalHoldings;
    positionsBySymbol = {
      ...positionsBySymbol,
      [positions[i]._id]: {
        ...positions[i],
        currentPrice: prices[p._id].USD,
      },
    };
  });

  res.status(200).send({ baseValue, currentValue, positions: positionsBySymbol });
};
