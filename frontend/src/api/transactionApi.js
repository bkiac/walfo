import axios from '../utils/axios';

export function createTransaction(transaction) {
  return axios.post('/transactions', transaction);
}

export function updateTransaction(transaction) {
  return axios.put(`/transactions/${transaction._id}`, transaction);
}

export function deleteTransaction(transaction) {
  return axios.delete(`/transactions/${transaction._id}`, transaction);
}
