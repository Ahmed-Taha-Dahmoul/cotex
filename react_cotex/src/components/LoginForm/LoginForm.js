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

    // Call login method from AuthContext
    const success = await login({ email, password });

    if (success) {
      const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/';
      navigate(lastVisitedPage); // Redirect to last visited page
      window.location.reload(); // Optionally reload the page to refresh data
    } else {
      // Handle specific error messages based on the response
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
