import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './Paginator.css';

const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack spacing={2} className="paginator-stack">
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
      />
    </Stack>
  );
};

export default Paginator;
