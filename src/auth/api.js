// src/auth/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/';

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login/`, credentials);
  console.log('Login API response:', response.data); // Add this line
  return {
    access: response.data.access,
    refresh: response.data.refresh,
    user: response.data.user
  };
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}register/`, userData);
  return {
    user: response.data.user,
    tokens: {
      access: response.data.access,
      refresh: response.data.refresh
    }
  };
};


export const refreshToken = async (refresh) => {
  const response = await axios.post(`${API_URL}refresh/`, { refresh });
  return response.data.access;
};