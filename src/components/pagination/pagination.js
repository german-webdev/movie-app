/* eslint-disable class-methods-use-this */
import React from 'react';
import { Pagination } from 'antd';

import './pagination.css';

const MyPagination = ({ nextPage, currentPage, totalResults }) => {
  return (
    <Pagination
      onChange={nextPage}
      current={currentPage}
      currentDefault={1}
      total={totalResults}
      responsive
      showSizeChanger={false}
      hideOnSinglePage
      pageSize={20}
    />
  );
};

export default MyPagination;
