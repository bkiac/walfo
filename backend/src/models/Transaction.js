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

transactionSchema.statics.getPortfolioNamesByUser = function(user) {
  return this.aggregate([
    {
      $match: { user: Types.ObjectId(user) },
    },
    {
      $group: {
        _id: '$portfolio',
      },
    },
  ]);
};

transactionSchema.statics.getPositionsByUserAndPortfolio = function(user, portfolio) {
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
    // Map `SELL` tx types to negative `amount` and manually include fields to help `$group` aggregation
    {
      $project: {
        symbol: '$symbol',
        date: '$date',
        amount: {
          $cond: {
            if: { $eq: ['BUY', '$type'] },
            then: '$amount',
            else: { $subtract: [0, '$amount'] },
          },
        },
        price: '$price',
        type: '$type',
        tags: '$tags',
      },
    },
    // Group by `symbol` and sum holdings and value
    {
      $group: {
        _id: '$symbol',
        totalHoldings: {
          $sum: '$amount',
        },
        baseValue: { $sum: { $multiply: ['$amount', '$price'] } },
        tags: { $first: '$tags.array' },
        transactions: { $push: '$$ROOT' },
      },
    },
    // Remove unnecessary properties from the tx objects
    {
      $project: {
        transactions: { symbol: 0, tags: 0 },
      },
    },
    // Restructure `baseValue` field into a nested property
    {
      $project: {
        _id: 0,
        symbol: '$_id',
        totalHoldings: '$totalHoldings',
        value: {
          base: '$baseValue',
        },
        tags: '$tags',
        transactions: '$transactions',
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
