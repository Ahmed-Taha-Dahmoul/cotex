import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import './GameDetail.css';
import windowsflag from './windows logo.svg';
import CommentSection from '../CommentSection/CommentSection'; // Import CommentSection component
import config from '../../config';
import DiscordWidget from '../DiscordComponent/DiscordComponent';

import Arabic from './languages_logo/Arabic.png';
import Brazil from './languages_logo/Brazil.png';
import Chinese from './languages_logo/Chinese.png';
import Coreano from './languages_logo/Coreano.png';
import Czech from './languages_logo/Czech.png';
import English from './languages_logo/English.png';
import Español from './languages_logo/Espanol.png';
import French from './languages_logo/French.png';
import German from './languages_logo/German.png';
import Italian from './languages_logo/Italian.png';
import Japanese from './languages_logo/Japanese.png';
import Polaco from './languages_logo/Polaco.png';
import Portuguese from './languages_logo/Portuguese.png';
import Russian from './languages_logo/Russian.png';
import Turkish from './languages_logo/Turkish.png';

const languageImages = {
  Arabic,
  Brazil,
  Chinese,
  Coreano,
  Czech,
  English,
  Español,
  French,
  German,
  Italian,
  Japanese,
  Polaco,
  Portuguese,
  Russian,
  Turkish,
};

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/games/${id}/`);
        setGame(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setLoading(false);
        // Handle error state or retry logic
      }
    };

    fetchGameDetails();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      const widget = document.querySelector('.discord-widget-container');
      if (widget) {
        if (window.innerWidth <= 768) {
          widget.style.opacity = '0';
        } else {
          widget.style.opacity = '1';
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFragmentNavigation = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#comment-')) {
        const commentId = hash.substring(8);
        setTimeout(() => {
          const commentElement = document.getElementById(`comment-${commentId}`);
          if (commentElement) {
            commentElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center', 
              inline: 'nearest' 
            });
          }
        }, 500); // Adjust delay if needed
      }
    };

    window.addEventListener('hashchange', handleFragmentNavigation);
    handleFragmentNavigation(); // Call on initial load

    return () => {
      window.removeEventListener('hashchange', handleFragmentNavigation);
    };
  }, []);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleDownloadClick = () => {
    setShowThankYou(true);
    window.location.href = `${game.download_link}`;
  };

  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeVideoId = game ? extractYouTubeVideoId(game.youtube_link) : null;

  const extractSections = (description) => {
    const sections = {
      mainDescription: '',
      minimumRequirements: '',
      recommendedRequirements: '',
      installationInstructions: ''
    };

    if (!description) return sections;

    const minReqIndex = description.indexOf('Minimum requirements');
    const recReqIndex = description.indexOf('Recommended requirements');
    const instIndex = description.indexOf('Installation instructions');

    if (minReqIndex !== -1) {
      sections.mainDescription = description.substring(0, minReqIndex).trim();
      sections.minimumRequirements = description.substring(minReqIndex, recReqIndex !== -1 ? recReqIndex : description.length)
        .replace('Minimum requirements', '')
        .trim();
    }

    if (recReqIndex !== -1) {
      sections.recommendedRequirements = description.substring(recReqIndex, instIndex !== -1 ? instIndex : description.length)
        .replace('Recommended requirements', '')
        .trim();
    }

    if (instIndex !== -1) {
      sections.installationInstructions = description.substring(instIndex)
        .replace('Installation instructions', '')
        .trim();
    }

    return sections;
  };

  const formatText = (text) => {
    return text.split('. ').join('.\n');
  };

  const { mainDescription, minimumRequirements, recommendedRequirements, installationInstructions } = game ? extractSections(game.description) : {};

  
  return (
    <Container>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <div className="body_content">
          <h1 className="main_title">Download {game.title}</h1>
          <div className="row game-page">
            <div className="col-md-3 game-img">
              <img
                className="post_image"
                src={`${config.API_URL}/${game.image_path}`}
                alt={`Download ${game.title}`}
                title={`Download ${game.title}`}
              />
            </div>
            <div className="col-md-9">
              <div className="col-md-6">
                <ul className="list">
                  <li>Name: <strong>{game.title}</strong></li>
                  <li className="platform">Platform: <strong>{game.platform}</strong>
                  <img
                    style={{ marginTop: '-9px' }}
                    className="console windowsflag"
                    src={windowsflag}
                    alt={`Games for ${game.platform}`}
                  />
                  </li>
                  <li className="language">Languages:
                    <span>
                      {game.languages.map((language, index) => {
                        const languageKey = language.replace('Idioma ', '');
                        const imagePath = languageImages[languageKey];
                        return (
                          <img
                            key={index}
                            className="post_flag"
                            src={imagePath}
                            title={languageKey}
                            alt={languageKey}
                          />
                        );
                      })}
                    </span>
                  </li>
                  <li>Genre:
                  <span className="category">
                    {game.genres.map((genre, index) => (
                      <React.Fragment key={index}>
                        <a href={`${config.LOCAL_URL}/category/?q=${genre}`} rel="category tag">{genre}</a>{index < game.genres.length - 1 && ', '}
                      </React.Fragment>
                    ))}
                  </span>

                  </li>
                  <li>Format: <strong>{game.format}</strong></li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list">
                  <li>Size: <strong>{game.size}</strong></li>
                  <li>Release Date: <strong>{game.release_date}</strong></li>
                  <li>Cracker: <strong>{game.cracker}</strong></li>
                  <li>Version: <strong>{game.version}</strong></li>
                </ul>
              </div>
              <div className="col-md-12">
                <h3 className="description">Description:</h3>
                <p className="details">
                  {showFullDescription ? mainDescription : mainDescription.split('\n').slice(0, 2).join('\n')}
                </p>
                <span id="view_full_description" onClick={toggleDescription} style={{ cursor: 'pointer', color: '#007bff' }}>
                  {showFullDescription ? 'View Less' : 'View Full Description >'}
                </span>

                <>
                  {minimumRequirements && (
                    <div className="requirements">
                      <h4>Minimum Requirements</h4>
                      <pre>{formatText(minimumRequirements)}</pre>
                    </div>
                  )}
                  {recommendedRequirements && (
                    <div className="requirements">
                      <h4>Recommended Requirements</h4>
                      <pre>{formatText(recommendedRequirements)}</pre>
                    </div>
                  )}
                  {installationInstructions && (
                    <div className="instructions">
                      <h4>Installation Instructions</h4>
                      <pre>{formatText(installationInstructions)}</pre>
                    </div>
                  )}
                </>

                <br/>
                <center>
                  <button
                    className="button"
                    type="button"
                    onClick={handleDownloadClick}
                    download={`${game.title}.torrent`}
                  >
                    <span className="button__text">Download</span>
                    <span className="button__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" id="bdd05811-e15d-428c-bb53-8661459f9307" data-name="Layer 2" className="svg">
                        <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                        <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                        <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                      </svg>
                    </span>
                  </button>
                </center>
                {showThankYou && (
                  <div className="thank_you">
                    <center>
                      <p>Your file has been downloaded!</p>
                      <span>The best way to thank us is by sharing this game. Come on... it will only take 5 seconds!</span>
                      <img id="helping" src={`${config.API_URL}/path_to_image/help_down.gif`} alt="Help Down" />
                      <div className="social_buttons">
                        <span rel="nofollow" onClick={() => window.open(`https://www.facebook.com/sharer.php?u=http://localhost:8000/games-pc/${game.slug}/`, 'mywin', 'width=500,height=500')} className="buttonsocial fa fa-facebook"></span>
                        <span rel="nofollow" onClick={() => window.open(`https://twitter.com/share?url=http://localhost:8000/games-pc/${game.slug}/`, 'mywin', 'width=500,height=500')} className="buttonsocial fa fa-twitter"></span>
                        <span rel="nofollow" onClick={() => window.open(`https://plus.google.com/share?url=http://localhost:8000/games-pc/${game.slug}/`, 'mywin', 'width=500,height=500')} className="buttonsocial fa fa-google"></span>
                        <span rel="nofollow" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=http://localhost:8000/games-pc/${game.slug}/&title=${game.title}&summary=&source=`, 'mywin', 'width=500,height=500')} className="buttonsocial fa fa-linkedin"></span>
                      </div>
                    </center>
                  </div>
                )}
                {youtubeVideoId && (
                  <div className="videoWrapperOuter">
                    <div className="videoWrapperInner">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        frameBorder="0"
                        allowFullScreen
                        title={game.title}
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="game-details">
            {/* Other game details */}
            {/* Comment Section */}
            <CommentSection gameId={id} />
          </div>
        </div>
      )}

      
    </Container>
  );
};

export default GameDetail;