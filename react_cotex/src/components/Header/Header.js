import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import tunisianFlag from './tunisia-flag.svg';

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const Header = () => {
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
    <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
      <div className="header-container">
        <Link className="logo" to="/">
          <img
            alt="Tunisian Flag"
            className="logo-img"
            src={tunisianFlag}
          />
          <span className="logo-text">GameHub</span>
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
          <div className="search-input-wrapper">
            <SearchIcon className="search-icon" />
            <input
              className="search-input"
              placeholder="Search games..."
              type="text"
            />
          </div>
          <button className="btn btn-signin">Sign In</button>
          <button className="btn btn-login">Login</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
