import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Game Library</h1>
      {loading ? (
        <p>Loading games...</p>
      ) : (
        <div>
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                <h2>{game.title}</h2>
                <p>{game.description}</p>
                <p>Release Date: {game.release_date}</p>
                {/* Add other game fields as needed */}
              </li>
            ))}
          </ul>
          <div>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameList;
