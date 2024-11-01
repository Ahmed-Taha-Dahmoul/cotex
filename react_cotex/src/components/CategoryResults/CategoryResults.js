import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import Paginator from '../Paginator/Paginator';
import config from '../../config';
import styles from './CategoryResults.module.css'; // Import as a CSS module

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CategoryResults = () => {
  const query = useQuery();
  const categoryTerm = query.get('q');
  const [categoryResults, setCategoryResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (categoryTerm) {
      fetchCategoryResults(categoryTerm, currentPage);
    }
  }, [categoryTerm, currentPage]);

  const fetchCategoryResults = async (term, page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_URL}/api/category/?q=${term}&page=${page}`);
      if (response.data && Array.isArray(response.data.results)) {
        setCategoryResults(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 30));
      } else {
        console.error('Unexpected response format:', response.data);
        setCategoryResults([]);
      }
    } catch (error) {
      console.error('Error fetching category results:', error);
      setCategoryResults([]);
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
    <div className={styles['container-category-results']}>
      <h2>Category Results for "{categoryTerm}"</h2>
      <div className="d-flex justify-content-center mt-4">
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Row gutter={[16, 16]} className={fade ? styles.fade : ''}>
        {loading ? (
          Array.from({ length: 30 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4} style={{ padding: '0 8px' }}>
              <Skeleton active />
            </Col>
          ))
        ) : (
          categoryResults.map((game) => (
            <Col key={game.id} xs={24} sm={12} md={8} lg={6} xl={4} style={{ padding: '0 8px' }}>
              <Link to={`/games/${game.id}`}>
                <div className={styles['game-card']}>
                  <div className={styles['game-cover']}>
                    <img alt="Game Cover" src={`${config.API_URL}/${game.image_path}`} />
                  </div>
                  <div className={styles['game-info']}>
                    <h3 className={styles['game-title']}>{game.title}</h3>
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

export default CategoryResults;
