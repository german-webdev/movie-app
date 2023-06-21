import React from 'react';
import _debounce from 'lodash/debounce';

import './search-area.css';

const SearchArea = ({ onHandleSubmit }) => {
  const debounceOnChange = _debounce(onHandleSubmit, 500);

  return <input onChange={debounceOnChange} className="search-input" type="text" placeholder="Type to search..." />;
};

export default SearchArea;
