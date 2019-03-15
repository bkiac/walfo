import * as authApi from '../api/authApi';
import sendRequest from '../utils/sendRequest';
import axios from '../utils/axios';

export async function register(credentials) {
  const res = await sendRequest(authApi.register, credentials);

  if (res.success) {
    axios.setBearerToken(res.success.token);
    localStorage.setItem('user', JSON.stringify(res.success));
  }

  return res;
}

export async function login(credentials) {
  const res = await sendRequest(authApi.login, credentials);

  if (res.success) {
    axios.setBearerToken(res.success.token);
    localStorage.setItem('user', JSON.stringify(res.success));
  }

  return res;
}

export function loginFromLocalStorage() {
  return JSON.parse(localStorage.getItem('user'));
}

export function logout() {
  axios.removeBearerToken();
  localStorage.removeItem('user');
}
