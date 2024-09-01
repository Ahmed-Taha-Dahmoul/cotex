import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from './LogoFinal.png';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-logo">
          <Link to="/">
            <img alt="Logo" src={logo} className="footer-logo-img pulse-animation" />
          </Link>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li><Link to="/about-us">Our Story</Link></li>
              <li><Link to="/team">Team</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <ul className="footer-socials">
              <li><a href="https://facebook.com">Facebook</a></li>
              <li><a href="https://twitter.com">Twitter</a></li>
              <li><a href="https://instagram.com">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 PixelRealmGames. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
