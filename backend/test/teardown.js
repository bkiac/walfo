const db = require('./database');

module.exports = async () => {
  await db.teardown();

  await global.server.close();
};
