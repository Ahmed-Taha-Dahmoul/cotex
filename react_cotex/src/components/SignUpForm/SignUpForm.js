import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignUpForm.css'; // Import CSS file for styling
import Title from '../Title/Title';

const SignUpForm = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages

    try {
      await register({ email, username, password });
      navigate('/'); // Redirect to home page after successful signup
      window.location.reload(); // Refresh the page instantly
    } catch (error) {
      // Display specific error messages from the backend
      if (error.response?.status === 400) {
        setError(error.response.data.email || 'An error occurred during registration.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    
    <div className='Body-Signup'>
    <div className="contain">
      <form className="signup-form" onSubmit={handleSubmit}>
      <div className='imgSignUp'>
        <Title underlined="Sign Up" colored="now"/>
        </div>
        {error && <div className="errmsg">{error}</div>}
        <div className="user-details">
        <div className="input-box">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
      </div>
      <div className="input-box">
       
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        </div>
        <div className="submit-button" >
                <input type="submit" value="Register"
                
              
                />
            </div>
      </form>
    </div>
    </div>
  );
};

export default SignUpForm;
