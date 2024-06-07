import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from './logo.png';
import SearchBar from '../SearchBar/SearchBar';

function Header() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollCount, setScrollCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage user's login status

  useEffect(() => {
    // Your scroll handling logic
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
    // Check if the user is already logged in (for example, by checking local storage)
    const userLoggedIn = localStorage.getItem('token');
    if (userLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear user authentication status and redirect to logout page or perform other logout actions
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Redirect to logout page or perform other actions after logout
  };

  return (
    <div className="search">
      <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
        <div className="header-container">
          <Link className="logo" to="/">
            <img alt="Tunisian Flag" className="logo-img" src={logo} />
          </Link>
          <nav className="nav-links">
            <Link className="nav-link" to="/action">
              Action
            </Link>
            <Link className="nav-link" to="/adventure">
              Adventure
            </Link>
            <Link className="nav-link" to="/simulation">
              Simulation
            </Link>
            <Link className="nav-link" to="/multiplayer">
              Multiplayer
            </Link>
          </nav>
          <div className="search-container">
            {isLoggedIn ? (
              <button className="btn btn-logout" onClick={handleLogout}>
                Log Out
              </button>
            ) : (
              <>
                <Link to="/signup" className="btn btn-signin">
                  Sign Up
                </Link>
                <button className="btn btn-login">Log In</button>
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
