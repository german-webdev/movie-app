/* eslint-disable class-methods-use-this */
import React from 'react';
import _debounce from 'lodash/debounce';

import './search-area.css';

const SearchArea = ({ onHandleSubmit, onHandleChange, searchTerm }) => {
  const debounceOnChange = _debounce(onHandleSubmit, 500);

  return (
    <form onChange={debounceOnChange} className="search-form">
      <input
        onChange={onHandleChange}
        className="search-input"
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
      />
    </form>
  );
};

export default SearchArea;
