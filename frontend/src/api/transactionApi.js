import axios from '../utils/axios';

export function createTransaction(transaction) {
  return axios.post('/transactions', transaction);
}

export function updateTransaction({ id, amount, price, tags, date }) {
  return axios.put(`/transactions/${id}`, { amount, price, tags, date });
}

export function removeTransaction(transaction) {
  return axios.delete(`/transactions/${transaction.id}`, transaction);
}
