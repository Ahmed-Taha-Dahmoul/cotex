import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import Paginator from '../Paginator/Paginator';
import './GameList.css';
import config from '../../config';
import GameCard from './GameCard';
import Title from '../Title/Title'
import ItemsCotainer from '../ItemsContainer/ItemsCotainer';

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
    <div>
      <ItemsCotainer>
      <Title underlined="See All" colored="Games"/>
  
      <Row className={fade ? 'fade' : ''}>
  {loading ? (
    [...Array(24)].map((_, index) => (
      <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4} style={{ padding: '0 8px' }}>
        <div className="game-card">
          <Skeleton active />
        </div>
      </Col>
    ))
  ) : (
    games.map((game) => (
      <Col key={game.id}>
        <Link to={`/games/${game.id}`}>
          <GameCard 
            image={`${config.API_URL}/${game.image_path}`} 
            title={game.title} 
            details={game.description} 
          />
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
      </ItemsCotainer>
    </div>
  );
};

export default GameList;
