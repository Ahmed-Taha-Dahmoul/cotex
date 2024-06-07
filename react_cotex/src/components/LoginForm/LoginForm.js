import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login/', formData);
      const userData = response.data;

      // Store the token in local storage
      localStorage.setItem('token', userData.access);

      // Fetch user profile data (assuming you have an endpoint to get the user profile)
      const profileResponse = await axios.get('http://localhost:8000/auth/profile/', {
        headers: {
          Authorization: `Bearer ${userData.access}`
        }
      });
      const profileData = profileResponse.data;

      // Store profile data in local storage
      localStorage.setItem('email', profileData.email);
      localStorage.setItem('profile_pic', profileData.profile_pic);
      localStorage.setItem('username', profileData.username);

      // Update isLoggedIn state and user data using the context
      login(profileData);
      setIsLoggedIn(true);

      // Navigate to home page
      navigate('/');

      // Refresh the page after navigating to the home page
      window.location.reload();

    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;
