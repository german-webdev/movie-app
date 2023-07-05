import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

import SearchArea from '../search-area';

import './tabs.css';

const Tab = ({ onChange, searchValue, onToggleTab }) => {
  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchArea onChange={onChange} searchValue={searchValue} />,
    },
    {
      key: '2',
      label: 'Rated',
      children: '',
    },
  ];

  return (
    <Tabs
      className="tabs"
      defaultActiveKey="1"
      items={items}
      centered="true"
      size="middle"
      onChange={() => onToggleTab()}
    />
  );
};

Tab.propTypes = {
  onChange: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onToggleTab: PropTypes.func.isRequired,
};

export default Tab;
