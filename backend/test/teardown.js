const db = require('./database');

module.exports = async () => {
  await db.teardown(true);

  await global.server.close();
};
