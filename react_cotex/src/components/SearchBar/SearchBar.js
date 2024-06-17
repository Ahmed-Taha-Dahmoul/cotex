import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Ensure this path is correct
import SearchIcon from './SearchIcon'; // Ensure this path is correct
import config from '../../config';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchWrapperRef = useRef(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() !== '') {
        try {
          const response = await axios.get(`${config.API_URL}/api/search/?q=${searchTerm}`);
          if (response.data && response.data.results) {
            setSearchResults(response.data.results);
            setShowResults(true); // Show results when there are search results
          } else {
            console.error('Unexpected response format:', response.data);
            setSearchResults([]);
            setShowResults(false); // Hide results when there are no search results
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
          setShowResults(false); // Hide results when there's an error
        }
      } else {
        setSearchResults([]);
        setShowResults(false); // Hide results when search term is empty
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    navigate(`/search_result?q=${searchTerm}`);
    setSearchTerm('');
    setShowResults(false); // Hide results when search is performed
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowResults(false); // Hide results if clicked outside the search bar container
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar-container" ref={searchWrapperRef}>
      <div className="search-input-wrapper">
        <SearchIcon className="search-icon" />
        <input
          className="search-input"
          placeholder="Search games..."
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch} className="search-button">🔍</button>
        {showResults && searchTerm && (
          <ul>
            {searchResults.map((game) => (
              <li key={game.id}>
                <a href={`${config.LOCAL_URL}/games/${game.id}`} className="game-link">
                  {game.image_path && (
                    <img
                      src={`${config.API_URL}/${game.image_path}`}
                      alt={`Cover for ${game.title}`}
                      className="game-cover"
                    />
                  )}
                  <span className="game-title">{game.title}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
