const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const {
  Schema,
  Schema: { ObjectId },
} = mongoose;
mongoose.Promise = global.Promise;

const transactionSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  portfolioName: {
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
  pricePerAmount: {
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
    type: ObjectId,
    ref: 'Tags',
  },
});

transactionSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Transaction', transactionSchema);
