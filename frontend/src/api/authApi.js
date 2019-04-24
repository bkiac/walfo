import axios from '../utils/axios';

export function register(credentials) {
  return axios.post('/auth/register', credentials);
}

export function login(credentials) {
  return axios.post('/auth/login', credentials);
}

export function changePassword(credentials) {
  return axios.post('/auth/change-password', credentials);
}
