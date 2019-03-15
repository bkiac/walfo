import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default axiosInstance;

export function setBearerToken(token) {
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
}

export function removeBearerToken() {
  axiosInstance.defaults.headers.Authorization = undefined;
}
