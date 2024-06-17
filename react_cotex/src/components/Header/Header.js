import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from './logo.png';
import SearchBar from '../SearchBar/SearchBar';
import { useAuth } from '../AuthContext';
import config from '../../config';

function Header() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { user, logout, isLoggedIn } = useAuth();
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  useEffect(() => {
    // Get profile picture path from local storage
    const storedProfilePic = localStorage.getItem('profile_pic');
    setProfilePic(storedProfilePic);
    
  }, []);

  return (
    <div className="search">
      <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
        <div className="header-container">
          <Link className="logo" to="/">
            <img alt="Logo" className="logo-img" src={logo} />
          </Link>
          <nav className="nav-links">
            <Link className="nav-link" to="/action">Action</Link>
            <Link className="nav-link" to="/adventure">Adventure</Link>
            <Link className="nav-link" to="/simulation">Simulation</Link>
            <Link className="nav-link" to="/multiplayer">Multiplayer</Link>
          </nav>
          <div className="search-container">
            {isLoggedIn() ? (
              <div className="profile-container">
                <div className="profile-circle">
                  {profilePic ? (
                    <img src={`${config.API_URL}/${profilePic}`} alt="Profile" className="profile-pic" />
                  ) : (
                    <img src="default-profile-pic.jpg" alt="Default Profile" className="profile-pic" />
                  )}
                </div>
                <button className="btn btn-logout" onClick={logout}>Log Out</button>
              </div>
            ) : (
              <>
                <Link to="/signup" className="btn btn-signup">Sign Up</Link>
                <Link to="/login" className="btn btn-login">Log In</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <SearchBar />
    </div>
  );
}

export default Header;