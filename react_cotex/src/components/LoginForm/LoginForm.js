import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import CSS file for styling
import ItemsCotainer from '../ItemsContainer/ItemsCotainer';
import Title from '../Title/Title';
import loginPhoto from './login.jpg'

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
      // Call login method from AuthContext
      const success = await login({ email, password });

      if (success) {
        const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/';
        navigate(lastVisitedPage); // Redirect to last visited page
        window.location.reload(); // Optionally reload the page to refresh data
      }
    } catch (error) {
      // Handle specific error messages based on the response
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <ItemsCotainer>
      <div className='containerLogin'>
      <div className='ImgRight'>
            <img src={loginPhoto} />
        </div>
        <div className='LoginLeft'>
        <Title underlined="Login" colored="Now"/>
      <form  onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
       
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className='InputLogin'
          /> <br/> <br/>
      
        
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className='InputLogin'
          /> <br/> <br/>
          <button className='LoginButton' type="submit" onClick={storeLastVisitedPage}>Login</button>
          <div className='linkSingUp'>
            <a href='/signup'>create account</a>
            </div>
       
      </form>
      </div>
      </div>
    </ItemsCotainer>
  );
};

export default LoginForm;
