const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.getPortfolioNames = async (req, res) => {
  const { user } = req.body;
  const portfolioNames = await Transaction.getPortfolioNamesByUser(user);
  res.status(200).send(portfolioNames);
};

exports.getPortfolioData = async (req, res) => {
  const { user } = req.body;
  const { portfolio } = req.params;
  const positions = await Transaction.getPositionsByUserAndPortfolio(user, portfolio);

  const portfolioBaseValue = positions
    .map((p) => p.value.base)
    .reduce((total, baseValue) => total + baseValue);

  const portfolioData = {
    baseValue: portfolioBaseValue,
    positions,
  };
  res.status(200).send(portfolioData);
};
