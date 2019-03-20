import axios from '../utils/axios';

export function getPortfolioNames() {
  return axios.get('/portfolios');
}
