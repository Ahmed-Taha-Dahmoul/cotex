import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from './logo.png';
import SearchBar from '../SearchBar/SearchBar';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollCount, setScrollCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logout } = useAuth();
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      if (prevScrollPos > currentScrollPos && scrollCount > 3) {
        setScrollCount(0);
      } else if (prevScrollPos < currentScrollPos) {
        setScrollCount((prevCount) => prevCount + 1);
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, scrollCount]);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('token');
    if (userLoggedIn) {
      setIsLoggedIn(true);
      setProfilePic(localStorage.getItem('profile_pic'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile_pic');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    logout();
    window.location.href = '/';
  };

  return (
    <div className="search">
      <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
        <div className="header-container">
          <Link className="logo" to="/">
            <img alt="Tunisian Flag" className="logo-img" src={logo} />
          </Link>
          <nav className="nav-links">
            <Link className="nav-link" to="/action">Action</Link>
            <Link className="nav-link" to="/adventure">Adventure</Link>
            <Link className="nav-link" to="/simulation">Simulation</Link>
            <Link className="nav-link" to="/multiplayer">Multiplayer</Link>
          </nav>
          <div className="search-container">
            {isLoggedIn ? (
              <div className="profile-container">
                <div className="profile-circle">
                  {profilePic ? (
                    <img src={`http://localhost:8000/${profilePic}`} alt="Profile" className="profile-pic" />
                  ) : (
                    <img src="default-profile-pic.jpg" alt="Default Profile" className="profile-pic" />
                  )}
                </div>
                <button className="btn btn-logout" onClick={handleLogout}>Log Out</button>
              </div>
            ) : (
              <>
                <Link to="/signup" className="btn btn-signin">Sign Up</Link>
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
