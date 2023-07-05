import React from 'react';
import PropTypes from 'prop-types';

import './search-area.css';

const SearchArea = ({ onHandleSearchValueChange, searchValue }) => {
  return (
    <div className="search">
      <input
        onChange={(event) => onHandleSearchValueChange(event.target.value)}
        className="search-input"
        type="text"
        placeholder="Type to search..."
        value={searchValue}
      />
    </div>
  );
};

SearchArea.propTypes = {
  onHandleSearchValueChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
};

export default SearchArea;
