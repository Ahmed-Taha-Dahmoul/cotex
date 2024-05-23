import React from 'react';
import { Button } from 'react-bootstrap';

const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const numPagesToShow = 5;

    if (currentPage !== 1) {
      pageNumbers.push(1);
    }

    if (currentPage > 3) {
      const startPage = Math.max(currentPage - 2, 2);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      for (let i = startPage; i < currentPage; i++) {
        pageNumbers.push(i);
      }
    }

    pageNumbers.push(currentPage);

    if (currentPage < totalPages - 2) {
      const endPage = Math.min(currentPage + 2, totalPages - 1);
      for (let i = currentPage + 1; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
    } else {
      for (let i = currentPage + 1; i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
    }

    if (currentPage !== totalPages) {
      pageNumbers.push(totalPages);
    }

    return (
      <div className="pagination">
        {pageNumbers.map((number, index) => (
          <React.Fragment key={index}>
            {number === '...' ? (
              <span className="ellipsis">...</span>
            ) : (
              <Button onClick={() => onPageChange(number)} disabled={number === currentPage}>
                {number === currentPage ? <strong>{number}</strong> : number}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return <div>{renderPageNumbers()}</div>;
};

export default Paginator;
