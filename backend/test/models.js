const mongoose = require('mongoose');

require('../src/models/User');
require('../src/models/Tags');
require('../src/models/Transaction');

global.User = mongoose.model('User');
global.Transaction = mongoose.model('Transaction');
global.Tags = mongoose.model('Tags');
