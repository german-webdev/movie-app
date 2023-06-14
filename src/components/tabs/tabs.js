/* eslint-disable class-methods-use-this */
import React from 'react';
import { Tabs } from 'antd';

import SearchArea from '../search-area';

import './tabs.css';

const Tab = ({ onSubmit, onChange }) => {
  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchArea onSubmit={onSubmit} onChange={onChange} />,
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
