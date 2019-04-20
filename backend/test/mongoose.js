const mongoose = require('mongoose');

require('../src/models/User');
require('../src/models/Tags');
require('../src/models/Transaction');

global.User = mongoose.model('User');
global.Tags = mongoose.model('Tags');
global.Transaction = mongoose.model('Transaction');

mongoose.connect(`${process.env.DATABASE}_test`, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
