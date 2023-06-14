/* eslint-disable class-methods-use-this */
import React from 'react';

import './search-area.css';

const SearchArea = ({ onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit} className="search-form">
      <input onChange={onChange} className="search-input" type="text" placeholder="Type to search..." />
    </form>
  );
};

export default SearchArea;
