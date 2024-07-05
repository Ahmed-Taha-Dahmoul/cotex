import React, { useState, useRef, useEffect } from 'react';
import styles from './ThreeDotsMenu.module.css';

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

  return (
    <div className={styles.threeDotsMenu} ref={menuRef}>
      <button onClick={handleMenuToggle} className={styles.threeDotsButton}>⋮</button>
      {isMenuOpen && (
        <div className={styles.menu}>
          <button onClick={onReport} className={`${styles.menuItem} ${styles.report}`}>Report this comment</button>
        </div>
      )}
    </div>
  );
};

export default ThreeDotsMenu;
