import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Paginator from '../Paginator/Paginator';
import './GameList.css';

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
      const response = await axios.get(`http://localhost:8000/api/games/?page=${page}`);
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
    <Container>
      <h1>Game Library</h1>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading games...</span>
        </Spinner>
      ) : (
        <div>
          <Row>
            {games.map((game) => (
              <Col key={game.id} sm={12} md={6} lg={4} xl={3}>
                <div className="relative group grid [grid-template-areas:stack] overflow-hidden rounded-lg">
                  <Link className="absolute inset-0 z-10" to={`/games/${game.id}`}>
                  </Link>
                  <img
                    alt="Game Cover"
                    className="[grid-area:stack] object-cover w-full aspect-square"
                    height="300"
                    src={game.image_url}
                    width="300"
                  />
                  <div className="flex-1 [grid-area:stack] bg-gray-900/70 group-hover:opacity-90 transition-opacity text-white p-4 lg:p-6 justify-end flex flex-col gap-2">
                    <h3 className="font-semibold tracking-tight">{game.title}</h3>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-between">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <Paginator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default GameList;
