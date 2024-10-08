import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import Paginator from '../Paginator/Paginator';
import styles from './GameList.module.css'; // Importing as a module
import config from '../../config';





const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fade, setFade] = useState(false); // Add fade state

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage]);

  const fetchGames = async (page) => {
    setLoading(true);
    console.log('Fetching games for page:', page);
    try {
      const response = await axios.get(`${config.API_URL}/api/games/?page=${page}`);
      console.log('Response received:', response.data);
      if (response.data && response.data.results) {
        setGames(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 30));
      } else {
        setGames([]);
        setTotalPages(1);
      }
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching the games!', error);
      setGames([]);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFade(true); // Start fade out
      setTimeout(() => {
        setCurrentPage(newPage);
        setFade(false); // End fade out
      }, 300); // Duration matches the CSS transition
    }
  };

  return (
    <div className={styles['container-game-list']}>
      <div className="d-flex justify-content-center mt-4">
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Row gutter={[16, 16]} className={fade ? styles.fade : ''}>
        {loading ? (
          [...Array(24)].map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4} style={{ padding: '0 8px' }}>
              <div className={styles['game-card']}>
                <Skeleton active />
              </div>
            </Col>
          ))
        ) : (
          games.map((game) => (
            <Col key={game.id} xs={24} sm={12} md={8} lg={6} xl={4} style={{ padding: '0 8px' }}>
              <Link to={`/games/${game.id}`}>
                <div className={styles['game-card']}>
                  <div className={styles['game-cover']}>
                    <img alt="Game Cover" src={`${config.API_URL}/${game.image_path}`} />
                  </div>
                  <div className={styles['game-info']}>
                    <h3 className={styles['game-title']}>{game.title}</h3>
                    <p className={styles['game-description']}>{game.description}</p>
                    <div className={styles['game-actions']}>
                      <span>Download</span>
                      <Link to={`/games/${game.id}`}>Details</Link>
                    </div>
                  </div>
                </div>
              </Link>
            </Col>
          ))
        )}
      </Row>
      <div className="d-flex justify-content-center mt-4">
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default GameList;
