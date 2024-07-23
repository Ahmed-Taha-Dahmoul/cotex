import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import './Header.css';
import logo from './logo.png';
import SearchBar from '../SearchBar/SearchBar';
import { useAuth } from '../AuthContext';
import config from '../../config';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { user, logout, isLoggedIn } = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  useEffect(() => {
    if (isLoggedIn()) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(`${config.API_URL}/comments/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API response:', response.data); // Log the response
      const sortedNotifications = Array.isArray(response.data.results)
        ? response.data.results.sort((a, b) => a.is_read - b.is_read) // Sort by read status
        : [];
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      await axios.patch(`${config.API_URL}/comments/notifications/${notificationId}/`, { is_read: true }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

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
          </nav>
          <div className="search-container">
            {isLoggedIn() ? (
              <div className="profile-container">
                <Dropdown show={showNotifications} onToggle={() => setShowNotifications(!showNotifications)}>
                  <Dropdown.Toggle as={Button} variant="light" className="notification-button">
                    <FontAwesomeIcon icon={faBell} />
                    {notifications.filter(notification => !notification.is_read).length > 0 && (
                      <span className="notification-badge">
                        {notifications.filter(notification => !notification.is_read).length}
                      </span>
                    )}
                                    </Dropdown.Toggle>
                  <Dropdown.Menu className="notification-list">
                    {notifications.length === 0 ? (
                      <Dropdown.Item>No notifications</Dropdown.Item>
                    ) : (
                      notifications.map(notification => (
                        <Dropdown.Item 
                          key={notification.id} 
                          className={`notification-item ${notification.is_read ? 'notification-read' : ''}`} 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div>
                            <strong>{notification.sender}</strong>
                            <span className="notification-message">{notification.message}</span>
                            <div className="notification-timestamp">
                              {new Date(notification.created_at).toLocaleString()}
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>
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

