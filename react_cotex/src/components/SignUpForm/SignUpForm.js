import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignUpForm.css';

const SignUpForm = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('You must agree to the terms and privacy policy.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({ email, username, password });
      navigate('/');
    } catch (error) {
      if (error.response?.status === 400) {
        setError(error.response.data.email || 'An error occurred during registration.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Join PixelRealmGames</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Pick a username"
            aria-required="true"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-required="true"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            aria-required="true"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            aria-required="true"
          />
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            aria-required="true"
          />
          <label htmlFor="terms">
            I'm 13 years of age or older and agree to the{' '}
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="terms-link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="terms-link">
              Privacy Policy
            </a>.
          </label>
        </div>
        
        <div className="form-group">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
