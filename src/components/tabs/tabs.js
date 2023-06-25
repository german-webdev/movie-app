import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

import SearchArea from '../search-area';

import './tabs.css';

const Tab = ({ onHandleSubmit, searchTerm, onToggleTab }) => {
  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchArea onHandleSubmit={onHandleSubmit} searchTerm={searchTerm} />,
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
  onHandleSubmit: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onToggleTab: PropTypes.func.isRequired,
};

export default Tab;
