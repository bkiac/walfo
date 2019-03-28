const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const moment = require('moment');

const { Schema, Types } = mongoose;
mongoose.Promise = global.Promise;

const schema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  portfolio: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true,
  },
  exchange: {
    type: String,
  },
  tags: {
    type: Schema.ObjectId,
    ref: 'Tags',
  },
});

const pipelines = {
  populateTags: [
    // Populate `tags`
    {
      $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' },
    },
    // Unwind `tags` array
    {
      $unwind: { path: '$tags' },
    },
    // Add `id` field
    {
      $project: {
        _id: 0,
        id: '$_id',
        user: '$user',
        portfolio: '$portfolio',
        symbol: '$symbol',
        date: '$date',
        amount: '$amount',
        price: '$price',
        type: '$type',
        exchange: '$exchange',
        tags: '$tags',
      },
    },
  ],

  groupByPosition: [
    // Group by `symbol` and calculate cost and number of bought coins
    {
      $group: {
        _id: '$symbol',
        tags: { $first: '$tags.array' },
        holdings: {
          $sum: {
            $cond: {
              if: { $eq: ['BUY', '$type'] },
              then: '$amount',
              else: { $subtract: [0, '$amount'] },
            },
          },
        },
        totalCost: {
          $sum: {
            $cond: {
              if: { $eq: ['BUY', '$type'] },
              then: { $multiply: ['$amount', '$price'] },
              else: 0,
            },
          },
        },
        numOfBoughtCoins: {
          $sum: {
            $cond: {
              if: { $eq: ['BUY', '$type'] },
              then: '$amount',
              else: 0,
            },
          },
        },
        transactions: { $push: '$$ROOT' },
      },
    },
    // Calculate cost from average coin price (total spent / number of coins) * current holdings
    {
      $project: {
        _id: 0,
        symbol: '$_id',
        tags: '$tags',
        holdings: '$holdings',
        cost: { $multiply: ['$holdings', { $divide: ['$totalCost', '$numOfBoughtCoins'] }] },
        transactions: '$transactions',
      },
    },
    // Remove obsolete tx fields
    {
      $project: {
        transactions: {
          user: 0,
          symbol: 0,
          portfolio: 0,
          tags: 0,
          __v: 0,
        },
      },
    },
  ],
};

schema.statics.getPortfolios = function getPortfolios(userId) {
  return this.distinct('portfolio', { user: Types.ObjectId(userId) });
};

schema.statics.getSymbols = function getSymbols(userId, portfolio, startDate) {
  const distinct = { user: Types.ObjectId(userId) };

  if (portfolio) {
    distinct.portfolio = portfolio;
  }

  if (startDate) {
    distinct.date = { $lte: new Date(startDate) };
  }

  return this.distinct('symbol', distinct);
};

schema.statics.getPositions = function getPositions(userId, portfolio, tags, startDate) {
  const match = { user: Types.ObjectId(userId), portfolio };

  if (startDate) {
    match.date = { $lte: new Date(startDate) };
  }

  const pipeline = [{ $match: match }];

  pipeline.push(...pipelines.populateTags);

  if (tags && tags.length > 0) {
    pipeline.push({
      $match: { $expr: { $setIsSubset: [tags, '$tags.array'] } },
    });
  }

  pipeline.push(...pipelines.groupByPosition);

  return this.aggregate(pipeline);
};

schema.statics.getPositionsForEachDayBetweenDates = function getPositionsForEachDayBetweenDates(
  userId,
  portfolio,
  startDate,
  endDate,
  tags,
) {
  const startMoment = moment(startDate);
  const numOfDays = Math.floor(moment.duration(moment(endDate).diff(startMoment)).asDays());

  const positionsForEachDay = [];
  for (let i = 1; i <= numOfDays; i += 1) {
    positionsForEachDay.push(this.getPositions(userId, portfolio, tags, startMoment));
    startMoment.add(1, 'day');
  }

  return Promise.all(positionsForEachDay);
};

schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Transaction', schema);
