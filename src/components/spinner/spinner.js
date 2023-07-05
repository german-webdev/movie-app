import React from 'react';
import { Space, Spin } from 'antd';

import './spinner.css';

const Spinner = () => {
  return (
    <Space direction="horizontal">
      <Space>
        <Spin tip="Loading" size="large">
          <div className="spinner" />
        </Spin>
      </Space>
    </Space>
  );
};

export default Spinner;
