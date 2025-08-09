import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL for non-auth endpoints
});

// This is an "interceptor"
// It runs before every request made with this 'api' instance
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      // If a token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;