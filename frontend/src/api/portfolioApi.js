import axios from '../utils/axios';

export function getPortfolioNames() {
  return axios.get('/portfolios');
}

export function getPortfolio(portfolio) {
  return axios.get(`/portfolios/${portfolio}/base`);
}
