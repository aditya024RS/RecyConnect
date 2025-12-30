import axios from 'axios';

// Use the same environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/auth/`;

const signup = (name, email, password) => {
  return axios.post(API_URL + 'register', { name, email, password });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', { email, password });
};

const logout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_role');
};

const forgotPassword = (email) => {
  return axios.post(`${API_URL}forgot-password?email=${email}`);
};

const resetPassword = (token, newPassword) => {
  return axios.post(API_URL + 'reset-password', { token, newPassword });
};

const authService = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;