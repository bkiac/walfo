const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const { Schema, Types } = mongoose;
mongoose.Promise = global.Promise;

const transactionSchema = new Schema({
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

transactionSchema.statics.getAllSymbolsByUser = function getAllSymbolsByUser(user) {
  return this.distinct('symbol', { user: Types.ObjectId(user) });
};

transactionSchema.statics.getPortfolioNamesByUser = function getPortfolioNamesByUser(user) {
  return this.distinct('portfolio', { user: Types.ObjectId(user) });
};

transactionSchema.statics.getPositionsByUserAndPortfolio = function getPositionsByUserAndPortfolio(
  user,
  portfolio,
) {
  return this.aggregate([
    // Find txs with `user` and `portfolio`
    {
      $match: { portfolio, user: Types.ObjectId(user) },
    },
    // Populate `tags`
    {
      $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' },
    },
    // Unwind `tags` array
    {
      $unwind: { path: '$tags' },
    },
    // Group by `symbol` and calculate cost and number of bought coins
    {
      $group: {
        _id: '$symbol',
        tags: { $first: '$tags.array' },
        totalHoldings: {
          $sum: {
            $cond: {
              if: { $eq: ['BUY', '$type'] },
              then: '$amount',
              else: { $subtract: [0, '$amount'] },
            },
          },
        },
        costOfBoughtCoins: {
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
    // Calculate average cost of a coin
    {
      $project: {
        tags: '$tags',
        totalHoldings: '$totalHoldings',
        avgCost: { $divide: ['$costOfBoughtCoins', '$numOfBoughtCoins'] },
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
  ]);
};

function autopopulate(next) {
  this.populate('tags');
  next();
}

transactionSchema.pre('find', autopopulate);
transactionSchema.pre('findOne', autopopulate);

transactionSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Transaction', transactionSchema);
