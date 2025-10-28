import axios from 'axios';
import { API_URL } from '../config/api';

// Use 127.0.0.1 para evitar problema de IPv6 do "localhost"
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;