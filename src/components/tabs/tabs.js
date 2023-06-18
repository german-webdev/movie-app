/* eslint-disable class-methods-use-this */
import React from 'react';
import { Tabs } from 'antd';

import SearchArea from '../search-area';

import './tabs.css';

const Tab = ({ onHandleSubmit, searchTerm }) => {
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

  return <Tabs className="tabs" defaultActiveKey="1" items={items} centered="true" size="middle" />;
};

export default Tab;
