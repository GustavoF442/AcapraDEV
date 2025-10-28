// Configuração da API
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment 
  ? 'http://127.0.0.1:5000/api'
  : 'https://acapradev.onrender.com/api';

export const BASE_URL = isDevelopment
  ? 'http://127.0.0.1:5000'
  : 'https://acapradev.onrender.com';
