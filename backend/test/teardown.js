const mongoose = require('mongoose');
require('../src/models/User');
require('../src/models/Tags');
require('../src/models/Transaction');

const User = mongoose.model('User');
const Tags = mongoose.model('Tags');
const Transaction = mongoose.model('Transaction');

module.exports = async () => {
  User.collection.drop();
  Tags.collection.drop();
  Transaction.collection.drop();

  await global.database.disconnect();

  await global.server.close();
};
