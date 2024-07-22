import React, { useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './Paginator.css';

const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        if (currentPage > 1) {
          onPageChange(currentPage - 1);
        }
      } else if (event.key === 'ArrowRight') {
        if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, onPageChange]);

  return (
    <div className="paginator-container">
      <Stack spacing={2} className="paginator-stack">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default Paginator;
