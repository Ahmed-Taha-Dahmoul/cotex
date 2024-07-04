// ThreeDotsMenu.js
import React, { useState, useRef, useEffect } from 'react';
import './ThreeDotsMenu.css';

const ThreeDotsMenu = ({ onReport }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.log('ThreeDotsMenu rendered');

  return (
    <div className="three-dots-menu" ref={menuRef}>
      <button onClick={handleMenuToggle} className="three-dots-button">⋮</button>
      {isMenuOpen && (
        <div className="menu">
          <button onClick={onReport} className="menu-item">Report this comment</button>
        </div>
      )}
    </div>
  );
};

export default ThreeDotsMenu;
