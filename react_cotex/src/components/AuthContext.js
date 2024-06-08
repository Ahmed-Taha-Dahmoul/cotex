import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state with null

  const login = async (userData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', userData);
      setUser(response.data.user); // Assuming your backend returns the user object
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
  
      if (!refreshToken) {
        console.error('No refresh token found');
        return;
      }
  
      const accessToken = localStorage.getItem('accessToken');
  
      
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      localStorage.removeItem('profile_pic');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/register/', userData);
      setUser(response.data.user); // Assuming your backend returns the user object
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    } catch (error) {
      console.error('Registration failed:', error.response.data);
    }
  };

  // Function to check if user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('accessToken') !== null;
  };

  // Automatically log in user if tokens are present
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Optionally, you can verify token and fetch user info from backend
      // For simplicity, we'll just assume the user is logged in if token exists
      axios.get('http://127.0.0.1:8000/auth/user/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      .then(response => setUser(response.data))
      .catch(error => console.error('Failed to fetch user:', error));
    }
  }, []);

  // Set localStorage items when user is set
  useEffect(() => {
    if (user) {
      localStorage.setItem('email', user.email);
      localStorage.setItem('username', user.username);
      localStorage.setItem('profile_pic', user.profile_pic);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};