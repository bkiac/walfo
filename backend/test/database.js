/**
 * Setup and teardown hooks to be included in each test which require database,
 * the globally setup mongoose connection isn't accessible in the individual tests for some reason.
 */
const mongoose = require('mongoose');
require('../src/models/User');
require('../src/models/Tags');
require('../src/models/Transaction');

const User = mongoose.model('User');
const Tags = mongoose.model('Tags');
const Transaction = mongoose.model('Transaction');

exports.setup = async function setup() {
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;
  const connection = await mongoose.connect(`${process.env.DATABASE}_test`, {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 5000,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  mongoose.connection.on('error', err => {
    console.error(err.message);
  });
  return connection;
};

exports.teardown = async function teardown() {
  await User.deleteMany({});
  await Tags.deleteMany({});
  await Transaction.deleteMany({});

  await mongoose.disconnect();
};
