import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Add CSS styling for the search bar if needed
import SearchIcon from './SearchIcon'; // Adjust the path if necessary
import config from '../../config';


function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() !== '') {
        try {
          const response = await axios.get(`${config.API_URL}/api/search/?q=${searchTerm}`);
          if (Array.isArray(response.data)) {
            setSearchResults(response.data);
          } else {
            console.error('Unexpected response format:', response.data);
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate(`/search_result?q=${searchTerm}`);
    }
  };

  return (
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
      <ul>
        {Array.isArray(searchResults) && searchResults.map((game) => (
          <li key={game.id}> {/* Assuming the API returns an ID for each game */}
            {game.name} {/* Assuming the API returns a game name */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;
