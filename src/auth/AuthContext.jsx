// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  login as apiLogin, 
  register as apiRegister, 
  refreshToken as apiRefreshToken 
} from './api';  
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  // Initialize user state from localStorage
 useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser && storedUser !== "undefined") {
    setUser(JSON.parse(storedUser));
  }
}, []);

 const login = async (credentials) => {
  try {
    const { access, refresh, user } = await apiLogin(credentials);
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    setAccessToken(access);
    setUser(user);

    // Role-based redirect
    if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else if (user.role === 'poster') {
      navigate('/poster-dashboard');
    } else if (user.role === 'booker') {
      navigate('/');
    } 
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const register = async (userData) => {
  try {
    const { user, tokens } = await apiRegister(userData);
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(user));
    setAccessToken(tokens.access);
    setUser(user);

    // Role-based redirect
    if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else if (user.role === 'poster') {
      navigate('/poster-dashboard');
    } else if (user.role === 'booker') {
      navigate('/');
    } 
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    navigate('/login');
  };

  // Add axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refresh = localStorage.getItem('refreshToken');
          if (refresh) {
            try {
              const newAccessToken = await apiRefreshToken(refresh);
              localStorage.setItem('accessToken', newAccessToken);
              setAccessToken(newAccessToken);
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              logout();
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);