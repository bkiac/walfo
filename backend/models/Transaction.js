const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const transactionSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply a user!',
  },
  portfolioName: {
    type: String,
    required: 'Portfolio is required!',
  },
  symbol: {
    type: String,
    required: 'Symbol is required!',
  },
  date: {
    type: Date,
    required: 'Date is required!',
  },
  amount: {
    type: Number,
    required: 'Amount is required!',
  },
  pricePerAmount: {
    type: Number,
    required: 'Price is required!',
  },
  exchange: {
    type: String,
  },
  tags: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tags',
  },
});

transactionSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Transaction', transactionSchema);
