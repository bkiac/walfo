import axios from '../utils/axios';

export function createTransaction(transaction) {
  return axios.post('/transactions', transaction);
}

export function updateTransaction({ portfolio, id, symbol, ...transaction }) {
  return axios.put(`/transactions/${id}`, transaction);
}

export function removeTransaction(transaction) {
  return axios.delete(`/transactions/${transaction.id}`, transaction);
}
