import axios from 'axios';

// Access the environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // dynamic base URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;