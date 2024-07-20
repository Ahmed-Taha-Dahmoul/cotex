import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    try {
      const response = await axios.post(`${config.API_URL}/auth/login/`, userData);
      setUser(response.data.user);
      sessionStorage.setItem('accessToken', response.data.access);
      sessionStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('profile_pic', response.data.user.profile_pic);
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error; // Throw error for component to handle
    }
  };

  const logout = () => {
    try {
      setUser(null);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('user_id');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      localStorage.removeItem('profile_pic');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${config.API_URL}/auth/register/`, userData);
      setUser(response.data.user);
      sessionStorage.setItem('accessToken', response.data.access);
      sessionStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('profile_pic', response.data.user.profile_pic);
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error; // Throw error for component to handle
    }
  };

  const isLoggedIn = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) return false;
    try {
      const decoded = jwtDecode(accessToken);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken && isLoggedIn()) {
      axios.get(`${config.API_URL}/auth/user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setUser(response.data);
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('profile_pic', response.data.profile_pic);
      })
      .catch(error => console.error('Failed to fetch user:', error));
    } else {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
