import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  useEffect(() => {
    const storedProfilePic = localStorage.getItem('profile_pic');
    setProfilePic(storedProfilePic);
  }, []);

  const handleLoginClick = () => {
    localStorage.setItem('lastVisitedPage', location.pathname);
  };

  return (
    <div className="search">
      <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
        <div className="header-container">
          <Link className="logo" to="/">
            <img alt="Logo" className="logo-img" src={logo} />
          </Link>
          <nav className="nav-links">
            <Link className="nav-link" to="/category/?q=Action">Action</Link>
            <Link className="nav-link" to="/category/?q=Adventure">Adventure</Link>
            <Link className="nav-link" to="/category/?q=Simulator">Simulation</Link>
            <Link className="nav-link" to="/category/?q=Sports"> Sports</Link>
          </nav>
          <div className="search-container">
            {isLoggedIn() ? (
              <div className="profile-container">
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic" className="profile-circle">
                    {profilePic ? (
                      <img src={`${config.API_URL}/${profilePic}`} alt="Profile" className="profile-pic" />
                    ) : (
                      <img src="default-profile-pic.jpg" alt="Default Profile" className="profile-pic" />
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <>
                <Link to="/signup" className="btn btn-signup">Sign Up</Link>
                <Link to="/login" className="btn btn-login" onClick={handleLoginClick}>Log In</Link>
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
