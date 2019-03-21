import axios from '../utils/axios';

// eslint-disable-next-line import/prefer-default-export
export function getCoinList() {
  return axios.get('/coins');
}
