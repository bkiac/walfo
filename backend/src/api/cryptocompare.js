/**
 * Based on `cryptocompare` NPM package.
 * https://www.npmjs.com/package/cryptocompare
 * Extended some features to allow batch requests and removed param reassignments.
 */
const fetch = require('node-fetch');
const helpers = require('../utils/helpers');

const baseUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

const cryptocompare = {};

cryptocompare.dateToTimestamp = function dateToTimestamp(date) {
  if (!(date instanceof Date)) throw new Error('timestamp must be an instance of Date.');
  return Math.floor(date.getTime() / 1000);
};

cryptocompare.fetchJSON = function fetchJSON(url) {
  let fullUrl = url;
  if (url.indexOf('?') > -1) {
    fullUrl += '&api_key=';
  } else {
    fullUrl += '?api_key=';
  }
  fullUrl += apiKey;

  return fetch(fullUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(body => {
      if (body.Response === 'Error') throw body.Message;
      return body;
    });
};

cryptocompare.coinList = function coinList() {
  const url = `${baseUrl}all/coinlist`;
  return cryptocompare.fetchJSON(url);
};

cryptocompare.exchangeList = function exchangeList() {
  const url = `${baseUrl}all/exchanges`;
  return cryptocompare.fetchJSON(url);
};

cryptocompare.constituentExchangeList = function constituentExchangeList(options = {}) {
  let url = `${baseUrl}all/includedexchanges`;
  if (options.instrument) url += `?instrument=${options.instrument}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.newsFeedsAndCategories = function newsFeedsAndCategories() {
  const url = `${baseUrl}news/feedsandcategories`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.newsList = function newsList(lang, options = {}) {
  let url = `${baseUrl}v2/news/?lang=${lang}`;
  if (options.feeds) url += `&feeds=${options.feeds}`;
  if (options.categories) url += `&categories=${options.categories}`;
  if (options.excludeCategories) url += `&categories=${options.excludeCategories}`;
  if (options.lTs) url += `&lTs=${cryptocompare.dateToTimestamp(options.lTs)}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.price = function price(fsym, tsyms, options = {}) {
  let url = `${baseUrl}price?fsym=${fsym}&tsyms=${tsyms}`;
  if (options.exchanges) url += `&e=${options.exchanges}`;
  if (options.tryConversion === false) url += '&tryConversion=false';
  return cryptocompare.fetchJSON(url);
};

cryptocompare.priceMulti = function priceMulti(fsyms, tsyms, options = {}) {
  let url = `${baseUrl}pricemulti?fsyms=${fsyms}&tsyms=${tsyms}`;
  if (options.exchanges) url += `&e=${options.exchanges}`;
  if (options.tryConversion === false) url += '&tryConversion=false';
  return cryptocompare.fetchJSON(url);
};

cryptocompare.priceMultiBatch = function priceMultiBatch(fsyms, tsyms, options) {
  const symbolChunks = helpers.chunk(fsyms, 50);
  const prices = symbolChunks.map(sch => cryptocompare.priceMulti(sch, tsyms, options));
  return Promise.all(prices);
};

cryptocompare.collectPriceMultiBatch = function collectPriceMultiBatch(priceMultiBatchResult) {
  return priceMultiBatchResult.reduce((p, pb) => ({
    ...p,
    ...pb,
  }));
};

cryptocompare.priceFull = function priceFull(fsyms, tsyms, options = {}) {
  let url = `${baseUrl}pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`;
  if (options.exchanges) url += `&e=${options.exchanges}`;
  if (options.tryConversion === false) url += '&tryConversion=false';
  // We want the RAW data, not the DISPLAY data:
  return cryptocompare.fetchJSON(url).then(result => result.RAW);
};

cryptocompare.priceHistorical = function priceHistorical(fsym, tsyms, time, options = {}) {
  let url = `${baseUrl}pricehistorical?fsym=${fsym}&tsyms=${tsyms}&ts=${cryptocompare.dateToTimestamp(
    time,
  )}`;
  if (options.exchanges) url += `&e=${options.exchanges}`;
  if (options.tryConversion === false) url += '&tryConversion=false';
  // The API returns json with an extra layer of nesting, so remove it
  return cryptocompare.fetchJSON(url).then(result => result[fsym]);
};

cryptocompare.generateAvg = function generateAvg(fsym, tsym, e, tryConversion) {
  let url = `${baseUrl}generateAvg?fsym=${fsym}&tsym=${tsym}&e=${e}`;
  if (tryConversion === false) url += '&tryConversion=false';
  return cryptocompare.fetchJSON(url).then(result => result.RAW);
};

cryptocompare.topPairs = function topPairs(fsym, limit) {
  let url = `${baseUrl}top/pairs?fsym=${fsym}`;
  if (limit) url += `&limit=${limit}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.topExchanges = function topExchanges(fsym, tsym, limit) {
  let url = `${baseUrl}top/exchanges?fsym=${fsym}&tsym=${tsym}`;
  if (limit) url += `&limit=${limit}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.topExchangesFull = function topExchangesFull(fsym, tsym, limit) {
  let url = `${baseUrl}top/exchanges/full?fsym=${fsym}&tsym=${tsym}`;
  if (limit) url += `&limit=${limit}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.histoDay = function histoDay(fsym, tsym, options = {}) {
  let url = `${baseUrl}histoday?fsym=${fsym}&tsym=${tsym}`;
  if (options.exchange) url += `&e=${options.exchange}`;
  if (options.limit === 'none') url += '&allData=true';
  else if (options.limit) url += `&limit=${options.limit}`;
  if (options.tryConversion === false) url += '&tryConversion=false';
  if (options.aggregate) url += `&aggregate=${options.aggregate}`;
  if (options.timestamp) url += `&toTs=${cryptocompare.dateToTimestamp(options.timestamp)}`;
  if (options.aggregatePredictableTimePeriods)
    url += `&aggregatePredictableTimePeriods=${options.aggregatePredictableTimePeriods}`;
  if (options.allData) url += `&allData=${options.allData}`;
  if (options.toTs) url += `&toTs=${options.toTs}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.histoDayBatch = function histoDayBatch(fsyms, tsym, options) {
  const histos = fsyms.map(fsym => cryptocompare.histoDay(fsym, tsym, options));
  return Promise.all(histos);
};

cryptocompare.collectHistoDayBatch = function collectHistoDayBatch(
  symbols,
  fsym,
  histoDayBatchResult,
) {
  return histoDayBatchResult.reduce(
    (p, hdb, i) => ({
      ...p,
      [symbols[i]]: hdb.map(hd => ({ [fsym]: (hd.open + hd.close + hd.high + hd.low) / 4 })),
    }),
    {},
  );
};

cryptocompare.histoHour = function histoHour(fsym, tsym, options = {}) {
  let url = `${baseUrl}histohour?fsym=${fsym}&tsym=${tsym}`;
  if (options.exchange) url += `&e=${options.exchange}`;
  if (options.limit) url += `&limit=${options.limit}`;
  if (options.tryConversion === false) url += '&tryConversion=false';
  if (options.aggregate) url += `&aggregate=${options.aggregate}`;
  if (options.timestamp) url += `&toTs=${cryptocompare.dateToTimestamp(options.timestamp)}`;
  if (options.allData) url += `&allData=${options.allData}`;
  if (options.toTs) url += `&toTs=${options.toTs}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.histoMinute = function histoMinute(fsym, tsym, options = {}) {
  let url = `${baseUrl}histominute?fsym=${fsym}&tsym=${tsym}`;
  if (options.exchange) url += `&e=${options.exchange}`;
  if (options.limit) url += `&limit=${options.limit}`;
  if (options.tryConversion === false) url += '&tryConversion=false';
  if (options.aggregate) url += `&aggregate=${options.aggregate}`;
  if (options.timestamp) url += `&toTs=${cryptocompare.dateToTimestamp(options.timestamp)}`;
  if (options.allData) url += `&allData=${options.allData}`;
  if (options.toTs) url += `&toTs=${options.toTs}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.latestSocial = function latestSocial(options = {}) {
  let url = `${baseUrl}social/coin/latest`;
  if (options.coinId) url += `?coinId=${options.coinId}`;
  return cryptocompare.fetchJSON(url).then(result => result.Data);
};

cryptocompare.histoSocial = function histoSocial(timePeriod, options = {}) {
  const url = `${baseUrl}social/coin/histo/${timePeriod === 'hour' ? 'hour' : 'day'}`;
  const query = [];
  if (options.coinId) query.push(`coinId=${options.coinId}`);
  if (options.aggregate >= 1 && options.aggregate <= 30)
    query.push(`aggregate=${options.aggregate}`);
  if (options.aggregate && typeof options.aggregatePredictableTimePeriods === 'boolean')
    query.push(`&aggregatePredictableTimePeriods=${options.aggregatePredictableTimePeriods}`);
  if (options.limit >= 1 && options.limit <= 2000) query.push(`limit=${options.limit}`);
  if (options.toTs) query.push(`toTs=${options.toTs}`);
  return cryptocompare
    .fetchJSON(`${url}${query.length > 0 ? `?${query.join('&')}` : ''}`)
    .then(result => result.Data);
};

cryptocompare.topCoinsByVolume = function topCoinsByVolume(tsym = 'USD', options = {}) {
  let url = `${baseUrl}top/totalvolfull?tsym=${tsym}`;
  if (options.limit) url += `&limit=${options.limit}`;
  if (options.page) url += `&page=${options.page}`;
  return cryptocompare.fetchJSON(url);
};

cryptocompare.topCoinsByMarketCap = function topCoinsByMarketCap(tsym = 'USD', options = {}) {
  let url = `${baseUrl}top/mktcapfull?tsym=${tsym}`;
  if (options.limit) url += `&limit=${options.limit}`;
  if (options.page) url += `&page=${options.page}`;
  return cryptocompare.fetchJSON(url);
};

module.exports = cryptocompare;
