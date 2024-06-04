import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import './GameDetail.css';
import windowsflag from './windows logo.svg';

import Arabic from './Arabic.png';
import Brazil from './Brazil.png';
import Chinese from './Chinese.png';
import Coreano from './Coreano.png';
import Czech from './Czech.png';
import English from './English.png';
import Español from './Espanol.png';
import French from './French.png';
import German from './German.png';
import Italian from './Italian.png';
import Japanese from './Japanese.png';
import Polaco from './Polaco.png';
import Portuguese from './Portuguese.png';
import Russian from './Russian.png';
import Turkish from './Turkish.png';

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
        const response = await axios.get(`http://localhost:8000/api/games/${id}/`);
        setGame(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleDownloadClick = () => {
    setShowThankYou(true);
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
                src={`http://localhost:8000/${game.image_path}`}
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
                          <a href={`http://localhost:8000/category/${genre.slug}/`} rel="category tag">{genre}</a>{index < game.genres.length - 1 && ', '}
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
                
                <br />
                <center>
                  <a
                    href={`${game.download_link}`}
                    id="download_torrent"
                    target="_blank"
                    className="btn full_button"
                    onClick={handleDownloadClick}
                  >
                    DOWNLOAD TORRENT <span className="glyphicon glyphicon-download-alt" style={{ marginLeft: '10px' }}></span>
                  </a>
                </center>
                {showThankYou && (
                  <div className="thank_you">
                    <center>
                      <p>Your file has been downloaded!</p>
                      <span>The best way to thank us is by sharing this game. Come on... it will only take 5 seconds!</span>
                      <img id="helping" src="http://localhost:8000/path_to_image/help_down.gif" alt="Help Down" />
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
        </div>
      )}
    </Container>
  );
};

export default GameDetail;
