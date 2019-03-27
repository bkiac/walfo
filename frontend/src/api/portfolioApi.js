import axios from '../utils/axios';

export function getPortfolioNames() {
  return axios.get('/portfolios');
}

export function getPortfolio(portfolio) {
  return axios.get(`/portfolios/${portfolio}`);
}

export function getHistoricalPortfolio(portfolio, date, tags) {
  return axios.get(`portfolios/${portfolio}/historical`, { params: { date, tags } });
}
