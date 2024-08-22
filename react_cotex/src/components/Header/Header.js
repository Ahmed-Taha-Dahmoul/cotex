import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import './Header.css';
import logo from './logo.png';
import SearchBar from '../SearchBar/SearchBar';
import { useAuth } from '../AuthContext';
import config from '../../config';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Nav from './Nav';



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
  console.log('22',config.API_URL)
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
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          el.classList.add('animate');
        } else {
          el.classList.remove('animate');
        }
      });
    };
  
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check
  
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
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
    <div className="search" style={{marginBottom:'10px'}}>
     <Nav logo={logo} isLoggedIn={isLoggedIn} notifications={notifications}
      profilePic={profilePic} logout={logout} markAsRead={markAsRead} />

  

    </div>
  );
}

export default Header;