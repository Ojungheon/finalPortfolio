import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageListLimit = 5;

  // 현재 페이지가 속한 페이지 그룹의 시작과 끝 페이지 계산
  const startPage =
    Math.floor((currentPage - 1) / pageListLimit) * pageListLimit + 1;
  const endPage = Math.min(startPage + pageListLimit - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePrevGroup = () => {
    onPageChange(Math.max(startPage - pageListLimit, 1));
  };

  const handleNextGroup = () => {
    onPageChange(Math.min(endPage + 1, totalPages));
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        padding: '15px 0',
      }}
    >
      {/* 맨 처음으로 */}
      <span
        style={{
          cursor: currentPage === 1 ? 'default' : 'pointer',
          color: currentPage === 1 ? 'lightgray' : 'black',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}
        onClick={() => currentPage !== 1 && onPageChange(1)}
      >
        &lt;&lt;
      </span>

      {/* 이전 그룹 */}
      <span
        style={{
          cursor: currentPage === 1 ? 'default' : 'pointer',
          color: currentPage === 1 ? 'lightgray' : 'black',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
        onClick={handlePrevGroup}
      >
        &lt;
      </span>

      {/* 페이지 번호 */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={page}>
          <span
            onClick={() => onPageChange(page)}
            style={{
              fontWeight: page === currentPage ? 'bold' : 'normal',
              color: page === currentPage ? '#8041FF' : 'black', // 현재 페이지만 보라색, 나머지는 검은색
              cursor: page === currentPage ? 'default' : 'pointer',
              fontSize: '1.3rem',
            }}
          >
            {page}
          </span>
          {/* 마지막 숫자 뒤에는 점 안 붙이게 */}
          {index < pageNumbers.length - 1 && (
            <span style={{ fontSize: '1.3rem', color: 'gray' }}> · </span>
          )}
        </React.Fragment>
      ))}

      {/* 다음 그룹 */}
      <span
        style={{
          cursor: currentPage === totalPages ? 'default' : 'pointer',
          color: currentPage === totalPages ? 'lightgray' : 'black',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
        onClick={handleNextGroup}
      >
        &gt;
      </span>

      {/* 맨 마지막으로 */}
      <span
        style={{
          cursor: currentPage === totalPages ? 'default' : 'pointer',
          color: currentPage === totalPages ? 'lightgray' : 'black',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}
        onClick={() => currentPage !== totalPages && onPageChange(totalPages)}
      >
        &gt;&gt;
      </span>
    </div>
  );
};

export default Pagination;
