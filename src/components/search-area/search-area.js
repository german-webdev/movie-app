import React from 'react';
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

export default SearchArea;
