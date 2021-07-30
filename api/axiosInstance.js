import axios from 'axios'
import {getItem} from '@/helpers/pStorage'

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/"
});

axiosInstance.interceptors.request.use((config) => {
  const token = getItem('accessToken')
  config.headers['X-Authorization'] = token ? `Bearer ${token}` : ''
  return config
})

export default axiosInstance;


