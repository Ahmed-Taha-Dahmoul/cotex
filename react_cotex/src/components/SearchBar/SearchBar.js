import React from 'react';
import './SearchBar.css'; // Add CSS styling for the search bar if needed
import SearchIcon from './SearchIcon'; // Import the SearchIcon component

function SearchBar() {
  return (
    <div className="search-input-wrapper">
      <SearchIcon className="search-icon" />
      <input
        className="search-input"
        placeholder="Search games..."
        type="text"
      />
    </div>
  );
}

export default SearchBar;
