import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.setBearerToken = token => {
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
};

axiosInstance.removeBearerToken = () => {
  axiosInstance.defaults.headers.Authorization = undefined;
};

export default axiosInstance;
