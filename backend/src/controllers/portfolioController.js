const mongoose = require('mongoose');
const moment = require('moment');
const cryptocompare = require('../api/cryptocompare');

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

  const symbols = await Transaction.getAllSymbolsByUserIdAndPortfolio(user, portfolio);
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

exports.getHistoricalPortfolioValues = async (req, res) => {
  const { user } = req;
  const { portfolio, date } = req.params;

  // The start of the day specified
  const startDate = moment(date)
    .utc()
    .startOf('day');
  // Yesterday, the end of the day
  const endDate = moment()
    .utc()
    .subtract(1, 'day')
    .endOf('day');
  const numOfDays = Math.floor(moment.duration(endDate.diff(startDate)).asDays());

  // Get all symbols for this duration
  const symbols = await Transaction.getAllSymbolsByUserIdAndPortfolioAndDate(user, portfolio, date);

  // Query cryptocompare for price data between yesterday and yesterday - N days
  const histoDayBatches = await cryptocompare.histoDayBatch(symbols, 'USD', {
    limit: numOfDays - 1,
    timestamp: endDate.toDate(),
  });
  // Collect individual historical price data into a single price object, and calculate default USD
  // from the average of open and close prices
  const prices = {};
  for (let i = 0; i < histoDayBatches.length; i += 1) {
    prices[symbols[i]] = histoDayBatches[i].map(dpd => ({
      USD: (dpd.open + dpd.close) / 2,
    }));
  }

  // Get position data for each day from the database
  let positionsByDay = [];
  for (let i = 1; i <= numOfDays; i += 1) {
    positionsByDay.push(
      Transaction.getPositionsByUserIdAndPortfolioAndDate(user, portfolio, startDate.add(1, 'day')),
    );
  }
  positionsByDay = await Promise.all(positionsByDay);

  // Calculate portfolio values per each day
  const portfolioValueByDay = positionsByDay.map((positions, i) =>
    positions.reduce((value, p) => {
      return prices[p._id][i].USD * p.totalHoldings;
    }, 0),
  );

  res.status(200).send(portfolioValueByDay);
};
