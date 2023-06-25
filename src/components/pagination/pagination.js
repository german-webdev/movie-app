import React from 'react';
import PropTypes from 'prop-types';
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

MyPagination.propTypes = {
  nextPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default MyPagination;
