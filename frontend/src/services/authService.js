import axios from 'axios';

// The base URL of our Spring Boot backend
const API_URL = 'http://localhost:8080/auth/';

/**
 * Sends a POST request to the /register endpoint.
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} Axios response promise
 */
const signup = (name, email, password) => {
  return axios.post(API_URL + 'register', {
    name,
    email,
    password,
  });
};

/**
 * Sends a POST request to the /login endpoint.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} Axios response promise
 */
const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  });
};

/**
 * Removes user token and role from localStorage.
 */
const logout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_role');
};

// We can add a getCurrentUser method later
const authService = {
  signup,
  login,
  logout,
};

export default authService;