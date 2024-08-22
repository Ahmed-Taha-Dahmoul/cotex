import React, { useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem'; // Add this line
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Paginator.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize the primary color
    },
    secondary: {
      main: '#f50057', // Customize the secondary color
    },
  },
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .Mui-selected': {
            backgroundColor: '#af9cf5', // Customize the selected page color
            color: '#fff',
          },
          '& .MuiPaginationItem-root': {
            
            color: 'white', // Text color
          },
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <div className="paginator-container">
        <Stack spacing={2} className="paginator-stack">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChange}
            variant="outlined"
            shape="rounded"
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIosNewIcon, next: ArrowForwardIosIcon }}
                {...item}
              />
            )}
          />
        </Stack>
      </div>
    </ThemeProvider>
  );
};

export default Paginator;
