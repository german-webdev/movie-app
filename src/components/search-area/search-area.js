import React from 'react';
import PropTypes from 'prop-types';

import './search-area.css';

const SearchArea = ({ onChange, searchValue }) => {
  return (
    <div className="search">
      <input
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
        type="text"
        placeholder="Type to search..."
        value={searchValue}
      />
    </div>
  );
};

SearchArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
};

export default SearchArea;
