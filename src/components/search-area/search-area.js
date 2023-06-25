import React from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';

import './search-area.css';

const SearchArea = ({ onHandleSubmit }) => {
  const debounceOnChange = _debounce(onHandleSubmit, 500);

  return (
    <div className="search">
      <input onChange={debounceOnChange} className="search-input" type="text" placeholder="Type to search..." />
    </div>
  );
};

SearchArea.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
};

export default SearchArea;
