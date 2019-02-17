const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.getPortfolioNames = async (req, res) => {
  const { user } = req;
  const portfolioNames = await Transaction.getPortfoliosByUserId(user);
  res.status(200).send(portfolioNames);
};

exports.getPortfolioData = async (req, res) => {
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
