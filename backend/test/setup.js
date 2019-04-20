const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

module.exports = async () => {
  await mongoose.connect(`${process.env.DATABASE}_test`, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;

  const app = require('../src/app');

  global.server = app.listen(process.env.PORT, process.env.HOST, () => {
    app.emit('started');
  });
};
