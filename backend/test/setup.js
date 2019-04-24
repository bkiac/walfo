const dotenv = require('dotenv');
const db = require('./database');

dotenv.config();

const app = require('../src/app');

module.exports = async () => {
  global.database = db.setup();

  global.server = app.listen(process.env.PORT, process.env.HOST, () => {
    app.emit('started');
  });
};
