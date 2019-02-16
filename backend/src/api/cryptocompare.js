const cryptocompare = require('cryptocompare');

cryptocompare.setApiKey(process.env.API_KEY);

module.exports = cryptocompare;
