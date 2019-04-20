const mongoose = require('mongoose');

const User = mongoose.model('User');
const Tags = mongoose.model('Tags');
const Transaction = mongoose.model('Transaction');

module.exports = async () => {
  await User.deleteMany({});
  await Tags.deleteMany({});
  await Transaction.deleteMany({});

  await mongoose.disconnect();

  global.server.close();
};
