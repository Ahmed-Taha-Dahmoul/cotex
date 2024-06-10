import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import CSS file for styling

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call login method from AuthContext
    const success = await login({ email, password });
    if (!success) {
      navigate('/'); // Redirect to home page if login fails
    } else {
      // Stay on the current page
      window.location.reload(); // Optionally reload the page to refresh data
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="form-group">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
