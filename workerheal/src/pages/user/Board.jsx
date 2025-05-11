import React from 'react';
import PaginationTable from '../common/PaginationTable';

const Board = () => {
  return <PaginationTable endpoint="/board/list" />;
};

export default Board;
