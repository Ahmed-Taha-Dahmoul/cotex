// src/components/NotFound/NotFound.js
import React, { useEffect } from 'react';
import styles from './NotFound.module.css'; // Import the CSS module
import { gsap } from 'gsap';

function NotFound() {
  useEffect(() => {
    gsap.fromTo(
      `.${styles.content}`,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  return (
    <div className={styles.notFound}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundImage}></div>
      </div>
      <div className={styles.content}>
        <h1>404</h1>
        <p>Oops! The page you’re looking for doesn’t exist.</p>
        <button className={styles.backHome} onClick={() => window.location.href = '/'}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default NotFound;
