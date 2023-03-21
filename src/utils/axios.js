import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

// axiosInstance.defaults.headers.Token = "8ae8d191-18b9-11ed-b136-06951b6b7f89";
// axiosInstance.defaults.headers.ShopId = 117552

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
