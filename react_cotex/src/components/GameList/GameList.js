import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import Paginator from '../Paginator/Paginator';
import './GameList.css';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;


const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage]);

  const fetchGames = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/games/?page=${page}`);
      setGames(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 30));
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the games!", error);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    
    <div className="container-game-list">
      <div className="d-flex justify-content-center mt-4">
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Row gutter={[16, 16]}>
        {games.map((game) => (
          <Col key={game.id} xs={24} sm={12} md={8} lg={6} xl={4} style={{ padding: '0 8px' }}>
            <Link to={`/games/${game.id}`}>
              <div className="game-card">
                <div className="game-cover">
                  <Skeleton loading={loading} active>
                    <img alt="Game Cover" src={`http://localhost:8000/${game.image_path}`} />
                  </Skeleton>
                </div>
                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>
                  <p className="game-description">{game.description}</p>
                  <div className="game-actions">
                    <span>Download</span>
                    <Link to={`/games/${game.id}`}>Details</Link>
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        ))}
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
