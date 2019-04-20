const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('../src/app');

module.exports = async () => {
  global.database = await mongoose.connect(`${process.env.DATABASE}_test`, {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 5000,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;

  global.server = app.listen(process.env.PORT, process.env.HOST, () => {
    app.emit('started');
  });
};
