import { isEmpty } from 'lodash';
import axios from '../utils/axios';

export function getPortfolioNames() {
  return axios.get('/portfolios');
}

export function getPortfolio(portfolio, tags) {
  return axios.get(`/portfolios/${portfolio}`, {
    params: { tags: isEmpty(tags) ? undefined : tags },
  });
}

export function getHistoricalPortfolio(portfolio, date, tags) {
  return axios.get(`portfolios/${portfolio}/historical`, {
    params: { date, tags: isEmpty(tags) ? undefined : tags },
  });
}
