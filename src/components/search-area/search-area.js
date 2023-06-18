/* eslint-disable class-methods-use-this */
import React from 'react';
import _debounce from 'lodash/debounce';

import './search-area.css';

const SearchArea = ({ onHandleSubmit, searchTerm }) => {
  const debounceOnChange = _debounce(onHandleSubmit, 500);

  return (
    <input
      onChange={debounceOnChange}
      className="search-input"
      type="text"
      placeholder="Type to search..."
      value={searchTerm}
    />
  );
};

export default SearchArea;
