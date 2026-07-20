import axios from 'axios';

const api = axios.create({
  baseURL: 'https://e-commerce-api-3wara.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // تسجيل الدخول لا يحتاج توكن قديم
    if (token && config.url !== '/auth/login') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;