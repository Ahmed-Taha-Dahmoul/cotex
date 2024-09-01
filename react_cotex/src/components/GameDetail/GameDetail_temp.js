import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import './GameDetail.css';
import windowsflag from './windowslogo.svg';
import CommentSection from '../CommentSection/CommentSection';
import config from '../../config';

// Import language images
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
  const location = useLocation();
  const [game, setGame] = useState(null);
  const [suggestedGames, setSuggestedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const commentRef = useRef(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/games/${id}/`);
        setGame(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  useEffect(() => {
    const fetchSuggestedGames = async () => {
        if (game) {
            try {
                // Build the params object conditionally
                const params = {};
                if (game.title) params.title = game.title;
                if (game.genres && game.genres.length > 0) params.genres = game.genres.join(',');
                if (game.languages && game.languages.length > 0) params.languages = game.languages.join(',');
                if (game.release_date) params.date = game.release_date;

                const response = await axios.get(`${config.API_URL}/api/suggestion/`, { params });
                setSuggestedGames(response.data);
            } catch (error) {
                console.error("Error fetching suggested games:", error);
            }
        }
    };

    fetchSuggestedGames();
}, [game]);


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
      minimumRequirements: {},
      recommendedRequirements: {},
      installationInstructions: ''
    };
  
    if (!description) return sections;
  
    const minReqIndex = description.indexOf('Minimum requirements');
    const recReqIndex = description.indexOf('Recommended requirements');
    const instIndex = description.indexOf('Installation instructions');
  
    if (minReqIndex !== -1) {
      sections.mainDescription = description.substring(0, minReqIndex).trim();
      sections.minimumRequirements = parseRequirements(
        description.substring(minReqIndex, recReqIndex !== -1 ? recReqIndex : description.length)
          .replace('Minimum requirements', '')
          .trim()
      );
    }
  
    if (recReqIndex !== -1) {
      sections.recommendedRequirements = parseRequirements(
        description.substring(recReqIndex, instIndex !== -1 ? instIndex : description.length)
          .replace('Recommended requirements', '')
          .trim()
      );
    }
  
    if (instIndex !== -1) {
      sections.installationInstructions = description.substring(instIndex)
        .replace('Installation instructions', '')
        .trim();
    }
  
    return sections;
  };
  
  const parseRequirements = (text) => {
    const lines = text.split('\n');
    const requirements = {};
  
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const label = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        requirements[label] = value;
      }
    });
  
    return requirements;
  };
  

  const formatText = (text) => {
    return text.split('. ').join('.\n');
  };

  const { mainDescription, minimumRequirements, recommendedRequirements, installationInstructions } = game ? extractSections(game.description) : {};

  const scrollWrapperRef = useRef(null);

  const scrollLeft = () => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollBy({
        left: -scrollWrapperRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollBy({
        left: scrollWrapperRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Container className="game-detail-container">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <div className="game-detail-body">
          <div className="game-header">
            <h1 className="game-title-1">{game?.title}</h1>
          </div>
          <div className="game-content">
    <div className="game-image">
        <img
            className="post-image"
            src={`${config.API_URL}/${game?.image_path}`}
            alt={`Download ${game?.title}`}
            title={`Download ${game?.title}`}
        />
    </div>
    <div className="game-info-1">
        <ul className="detail-list-1">
            <li><strong>Name:</strong> {game?.title}</li>
            <li><strong>Platform:</strong> {game?.platform}  
                    <img 
                      className="consolewindowsflag"
                      src={windowsflag}
                      alt={`Games for ${game?.platform}`}
                    />
            </li>
            <li><strong>Languages:</strong> 
                {game?.languages?.map((language, index) => {
                    const languageKey = language.replace('Idioma ', '');
                    const imagePath = languageImages[languageKey];
                    return (
                        <img
                            key={index}
                            className="language-icon"
                            src={imagePath}
                            title={languageKey}
                            alt={languageKey}
                        />
                    );
                })}
            </li>
            <li><strong>Genre:</strong> 
                {game?.genres?.map((genre, index) => (
                    <React.Fragment key={index}>
                        <a href={`${config.LOCAL_URL}/category/?q=${genre}`} rel="category tag">{genre}</a>{index < game.genres.length - 1 && ', '}
                    </React.Fragment>
                ))}
            </li>
            <li><strong>Format:</strong> {game?.format}</li>
            <li><strong>Size:</strong> {game?.size}</li>
            <li><strong>Release Date:</strong> {game?.release_date}</li>
            <li><strong>Cracker:</strong> {game?.cracker}</li>
            <li><strong>Version:</strong> {game?.version}</li>
        </ul>
    </div>
</div>

            <div className="game-description">
                <h3>Description:</h3>
                <p>
                    {showFullDescription ? mainDescription : mainDescription.split('\n').slice(0, 2).join('\n')}
                </p>
                <span className="toggle-description" onClick={toggleDescription}>
                    {showFullDescription ? 'View Less' : 'View Full Description >'}
                </span>
            </div>

            <div className="requirements-section">
              {minimumRequirements && (
                <div className="requirements">
                  <h4>Minimum Requirements</h4>
                  {Object.entries(minimumRequirements).map(([label, value], index) => (
                    <div key={index} className="requirement-row">
                      <span className="label">{label}:</span>
                      <span className="value">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              {recommendedRequirements && (
                <div className="requirements">
                  <h4>Recommended Requirements</h4>
                  {Object.entries(recommendedRequirements).map(([label, value], index) => (
                    <div key={index} className="requirement-row">
                      <span className="label">{label}:</span>
                      <span className="value">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              {installationInstructions && (
                <div className="installation">
                  <h4>Installation Instructions</h4>
                  <pre>{formatText(installationInstructions)}</pre>
                </div>
              )}
            </div>


            <div class="download-container">
              <label class="download-button" onClick={handleDownloadClick}>
                <input class="download-checkbox" type="checkbox" />
                <span class="download-circle">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    class="download-icon"
                  >
                    <path
                      d="M12 19V5m0 14-4-4m4 4 4-4"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke="currentColor"
                    ></path>
                  </svg>
                  <div class="download-square"></div>
                </span>
                <p class="download-title">Download</p>
                <p class="download-title">Open</p>
              </label>
            </div>

            {showThankYou && (
            <div className="thank-you-message">
              Thank you for downloading {game?.title}! Enjoy the game.
            </div>
          )}

            {youtubeVideoId && (
                  <div className="videoWrapperOuter">
                    <div className="videoWrapperInner">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        frameBorder="0"
                        allowFullScreen
                        title={game?.title}
                      ></iframe>
                    </div>
                  </div>
                )}


          <div className="suggested-games-section">
            <h3>You Might Also Like</h3>
            <div className="scroll-container">
              <button className="scroll-button left" onClick={scrollLeft}>‹</button>
              <button className="scroll-button right" onClick={scrollRight}>›</button>
              <div className="scroll-wrapper" ref={scrollWrapperRef}>
                <div className="suggested-games">
                  {suggestedGames.map((game, index) => (
                    <Link to={`/games/${game.id}`} key={index} className="suggested-game">
                       
                      <img
                        className="suggested-game-image"
                        src={`${config.API_URL}/${game.image_path}`}
                        alt={`Download ${game.title}`}
                        title={`Download ${game.title}`}
                      />
                      <div className="suggested-game-info">
                        <p className="suggested-game-title">{game.title}</p>
                        <p className="suggested-game-genre">
                          {game.genres?.join(', ')}
                          {game.version}
                        </p>
                        
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          

          
            <CommentSection gameId={id} ref={commentRef} />
          
        </div>
      )}
    </Container>
  );
};

export default GameDetail;
