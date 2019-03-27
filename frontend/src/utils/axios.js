import axios from 'axios';
import Qs from 'qs';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'comma' }),
});

axiosInstance.setBearerToken = token => {
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
};

axiosInstance.removeBearerToken = () => {
  axiosInstance.defaults.headers.Authorization = undefined;
};

export default axiosInstance;
