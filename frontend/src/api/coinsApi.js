import axios from '../utils/axios';

export function getCoinList() {
  return axios.get('/coins');
}

export function getTopCoinsByVolume() {
  return axios.get('/coins/top/volume');
}

export function getTopCoinsByMarketCap() {
  return axios.get('/coins/top/market-cap');
}

export function getFullMarketDataForCoins(symbols) {
  return axios.get('/coins/market-data', {
    params: { symbols },
  });
}

export function getHistoricalDataForCoin(symbol, startDate, endDate) {
  return axios.get('/coins/historical', {
    params: { symbol, startDate, endDate },
  });
}
