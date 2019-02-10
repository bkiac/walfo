const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction');

exports.getPortfolioNames = async (req, res) => {
  const { user } = req.body;
  let portfolioNames = await Transaction.getPortfolioNamesByUser(user);
  // eslint-disable-next-line no-underscore-dangle
  portfolioNames = portfolioNames.map((p) => p._id);
  res.status(200).send(portfolioNames);
};

// @todo: validation
exports.getPortfolioData = async (req, res) => {
  const { user } = req.body;
  const { portfolio } = req.params;
  const positions = await Transaction.getPositionsByUserAndPortfolio(user, portfolio);
  // @todo: Get current price data from API for the present symbols
  // Set position.value.current = ...

  const portfolioBaseValue = positions
    .map((p) => p.value.base)
    .reduce((total, baseValue) => total + baseValue);
  // @todo: Collect current value after API call
  // const portfolioCurrentValue = positions.reduce((p) => p.value.current);

  const portfolioData = {
    value: {
      base: portfolioBaseValue,
      current: 'TODO',
    },
    positions,
  };
  res.status(200).send(portfolioData);
};
