import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import CSS file for styling

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to store the current URL in localStorage
  const storeLastVisitedPage = () => {
    localStorage.setItem('lastVisitedPage', window.location.pathname);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages

    try {
      const success = await login({ email, password });

      if (success) {
        const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/';
        navigate(lastVisitedPage); // Redirect to last visited page
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-required="true"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            aria-required="true"
          />
        </div>
        
        <div className="form-group">
          <button type="submit" onClick={storeLastVisitedPage}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
