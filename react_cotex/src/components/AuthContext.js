import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import statement

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
      return true; // Indicate login was successful
    } catch (error) {
      console.error('Login failed:', error.response.data);
      return false; // Indicate login failed
    }
  };

  const logout = async () => {
    try {
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
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return false; // No access token, user not logged in
    try {
      const decoded = jwtDecode(accessToken); // Corrected usage
      return decoded.exp * 1000 > Date.now(); // Check if token is not expired
    } catch (error) {
      console.error('Invalid token:', error);
      return false; // Token is invalid, user not logged in
    }
  };

  // Automatically log in user if tokens are present
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && isLoggedIn()) {
      // Token is valid, fetch user info
      axios.get('http://127.0.0.1:8000/auth/user/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => setUser(response.data))
      .catch(error => console.error('Failed to fetch user:', error));
    } else {
      // Token expired or invalid, log the user out
      logout();
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
