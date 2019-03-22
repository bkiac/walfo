const mongoose = require('mongoose');
const moment = require('moment');
const cryptocompare = require('../api/cryptocompare');

const Transaction = mongoose.model('Transaction');

exports.getPortfolioNames = async (req, res) => {
  const { user } = req;
  const portfolioNames = await Transaction.getPortfolios(user);
  res.status(200).send(portfolioNames);
};

exports.getBasePortfolioData = async (req, res) => {
  const { user } = req;
  const { portfolio } = req.params;
  const { tags } = req.query;

  const positions = await Transaction.getPositions(user, portfolio, tags);

  const cost = positions.reduce((c, p) => c + p.avgCost * p.totalHoldings, 0);

  res.status(200).send({ name: portfolio, cost, positions });
};

exports.getHistoricalPortfolioValues = async (req, res) => {
  const { user } = req;
  const { portfolio } = req.params;
  const { date, tags } = req.query;

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
  const symbols = await Transaction.getSymbols(user, portfolio, startDate);

  // Get position data for each day from the database
  const positionsByDay = await Transaction.getPositionsForEachDayBetweenDates(
    user,
    portfolio,
    startDate,
    endDate,
    tags,
  );

  // Query cryptocompare for price data between yesterday and yesterday - N days
  // and collect results into a single prices object
  const prices = cryptocompare.collectHistoDayBatch(
    symbols,
    'USD',
    await cryptocompare.histoDayBatch(symbols, 'USD', {
      limit: numOfDays - 1,
      timestamp: endDate.toDate(),
    }),
  );

  // Calculate portfolio values per each day
  const portfolioValuePerDay = positionsByDay.map((positions, i) =>
    positions.reduce((value, p) => prices[p.id][i].USD * p.totalHoldings, 0),
  );

  return res.status(200).send(portfolioValuePerDay);
};

exports.getPortfolioDataWithPrices = async (req, res) => {
  const { user } = req;
  const { portfolio } = req.params;

  const symbols = await Transaction.getAllSymbolsByUserIdAndPortfolio(user, portfolio);
  const positions = await Transaction.getPositions(user, portfolio);
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
