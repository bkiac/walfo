import axios from '../utils/axios';

export function register(credentials) {
  return axios.post('/users/register', credentials);
}

export function login(credentials) {
  return axios.post('/auth/login', credentials);
}
