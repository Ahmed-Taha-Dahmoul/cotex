import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [showPCGamesDropdown, setShowPCGamesDropdown] = useState(false);

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
      console.log(response.data.results)

      const sortedNotifications = Array.isArray(response.data.results)
        ? response.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const markAsRead = async (notificationId, gameUrl) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      await axios.patch(`${config.API_URL}/comments/notifications/${notificationId}/`, { is_read: true }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotifications();

      if (gameUrl) {
        const commentMatch = gameUrl.match(/#comment-(\d+)$/);
        if (commentMatch) {
          const commentId = commentMatch[1];
          navigate(gameUrl);
          setTimeout(() => {
            const commentElement = document.getElementById(`comment-${commentId}`);
            if (commentElement) {
              commentElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500);
        } else {
          navigate(gameUrl);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  const handleLoginClick = () => {
    localStorage.setItem('lastVisitedPage', location.pathname);
  };

  const handlePCGamesDropdownToggle = () => {
    setShowPCGamesDropdown(!showPCGamesDropdown);
  };

  return (
    <div className="search">
      <header className={`header-container ${visible ? 'header-visible' : 'header-hidden'}`}>
        <Link className="header-logo-img" to="/">
          <img alt="Logo" className="header-logo-img" src={logo} />
        </Link>

        <div className="header-right">
          <nav className="header-nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => `header-nav-link ${isActive ? 'active-link' : ''}`}
            >
              HOME
            </NavLink>
            <div
              className="header-nav-link-container"
              onMouseEnter={handlePCGamesDropdownToggle}
              onMouseLeave={handlePCGamesDropdownToggle}
            >
              <span className="header-nav-link">PC GAMES ▼</span>
              {showPCGamesDropdown && (
                <div className="dropdown-content">
                  <div className="dropdown-grid">
                    <ul>
                      <li><NavLink to="/category/?q=Action" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Action</NavLink></li>
                      <li><NavLink to="/category/?q=Adventure" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Adventure</NavLink></li>
                      <li><NavLink to="/category/?q=RPG" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>RPG</NavLink></li>
                      <li><NavLink to="/category/?q=Careers" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Careers</NavLink></li>
                      <li><NavLink to="/category/?q=Indie" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Indie</NavLink></li>
                      <li><NavLink to="/category/?q=Simulator" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Simulator</NavLink></li>
                      <li><NavLink to="/category/?q=Open world" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Open world</NavLink></li>
                      <li><NavLink to="/category/?q=ROLE" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>ROLE</NavLink></li>
                    </ul>
                    <ul>
                      <li><NavLink to="/category/?q=Strategy" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Strategy</NavLink></li>
                      <li><NavLink to="/category/?q=Sandbox" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Sandbox</NavLink></li>
                      <li><NavLink to="/category/?q=Terror" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Terror</NavLink></li>
                      <li><NavLink to="/category/?q=Exploration" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Exploration</NavLink></li>
                      <li><NavLink to="/category/?q=Struggle" className={({ isActive }) => `dropdown-link ${isActive ? 'active-link' : ''}`}>Struggle</NavLink></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <NavLink 
              to="/online-games" 
              className={({ isActive }) => `header-nav-link ${isActive ? 'active-link' : ''}`}
            >
              ONLINE GAMES
            </NavLink>
            <NavLink 
              to="/faq" 
              className={({ isActive }) => `header-nav-link ${isActive ? 'active-link' : ''}`}
            >
              FAQ
            </NavLink>
            <NavLink 
              to="/about-us" 
              className={({ isActive }) => `header-nav-link ${isActive ? 'active-link' : ''}`}
            >
              ABOUT US
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `header-nav-link ${isActive ? 'active-link' : ''}`}
            >
              CONTACT US
            </NavLink>
          </nav>

          <div className="header-search-container">
            <SearchBar />
          </div>

          <div className="header-user-options">
            {isLoggedIn() ? (
              <>
                <Dropdown
                  show={showNotifications}
                  onToggle={() => setShowNotifications(!showNotifications)}
                >
                  <Dropdown.Toggle as={Button} variant="light" className="header-notification-button">
                    <FontAwesomeIcon icon={faBell} />
                    {notifications.filter(notification => !notification.is_read).length > 0 && (
                      <span className="header-notification-badge">
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
                          onClick={() => markAsRead(notification.id, notification.game_url)}
                        >
                          {!notification.is_read && <div className="notification-dot"></div>}
                          <img 
                            src={`${config.API_URL}/${notification.sender_profile_pic}`} 
                            alt="Sender Profile" 
                            className="notification-profile-pic" 
                          />
                          <div>
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
                  <Dropdown.Toggle variant="light" id="dropdown-basic" className="header-profile-circle">
                    <img src={`${config.API_URL}/${profilePic}`} alt="Profile" className="header-profile-img" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              </>
            ) : (
              <>
                <Link to="/signup" className="header-btn-signup">Sign Up</Link>
                <Link to="/login" className="header-btn-login" onClick={handleLoginClick}>Log In</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
