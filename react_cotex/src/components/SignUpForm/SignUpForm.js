import React, { useState } from 'react';
import './styles.css';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa'; // Import icons from react-icons
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/register/', formData);
      console.log(response.data);
      // Handle successful registration
      // Assuming the response contains a token after successful sign-up
      const token = response.data.token;

      // Store the token in local storage or a cookie for future requests
      localStorage.setItem('token', token);

      // Redirect to home page or any other page after successful sign-up and login
      navigate('/'); // Redirect to home page

    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <div className="social-signup">
        <p>Or sign up with</p>
        <div className="social-icons">
          <FaGoogle className="icon google" />
          <FaFacebook className="icon facebook" />
          <FaTwitter className="icon twitter" />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
