import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from './logo.png';
import SearchBar from '../SearchBar/SearchBar'; // Import the SearchBar component

function Header() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollCount, setScrollCount] = useState(0);

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

  return (
    <div className="search">
      <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
        <div className="header-container">
          <Link className="logo" to="/">
            <img
              alt="Tunisian Flag"
              className="logo-img"
              src={logo}
            />
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
            <button className="btn btn-signin">Sign In</button>
            <button className="btn btn-login">Log In</button>
          </div>
        </div>
      </header>
      <SearchBar /> {/* Include the SearchBar component here */}
    </div>
  );
}

export default Header;
