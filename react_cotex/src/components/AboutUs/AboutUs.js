import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; // Import the CSS file for styling

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="background-blur"></div> {/* Layer for background blur effect */}
      <div className="content">
        <h1>About Us</h1>
        <p>Hello!</p>
        <p>
          If you opened this window, then you are probably interested to know about our site. If you did this by accident, then you can close this page 🙂.
        </p>
        <p>
          This site was created to share Games already on the internet. We don’t crack games and we don’t host games and torrents. All we do is reupload trusted games and releases. We did not make the site thematic, deciding to simply publish various material – games: online, update games, Repack games… etc.
        </p>
        <p>
          If you want to help this project, just tell your friends about the site. If you have questions, suggestions or recommendations, then write to the <Link to="/contact" className="contact-link">administration</Link>.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
