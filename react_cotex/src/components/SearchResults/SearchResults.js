import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import Paginator from '../Paginator/Paginator';
import styles from './SearchResults.module.css'; // Updated import for module CSS
import config from '../../config';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('q');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fade, setFade] = useState(false); // For page transition

  useEffect(() => {
    fetchSearchResults(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const fetchSearchResults = async (term, page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_URL}/api/search/?q=${term}&page=${page}`);
      if (response.data && Array.isArray(response.data.results)) {
        setSearchResults(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 30));
      } else {
        console.error('Unexpected response format:', response.data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFade(true);
      setTimeout(() => {
        setCurrentPage(newPage);
        setFade(false);
      }, 300);
    }
  };

  return (
    <div className={`${styles['container-search-results']} ${fade ? styles.fade : ''}`}>
      <h2>Search Results for "{searchTerm}"</h2>
      <div className="d-flex justify-content-center mt-4">
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Row gutter={[16, 16]}>
        {loading ? (
          Array.from({ length: 30 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4} style={{ padding: '0 8px' }}>
              <Skeleton active />
            </Col>
          ))
        ) : (
          searchResults.map((game) => (
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

export default SearchResults;
