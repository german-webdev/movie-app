import React from 'react';
import { Space, Spin } from 'antd';

import './spinner.css';

const Spinner = () => {
  return (
    <Space
      direction="horizontal"
      style={{
        position: 'absolute',
        width: '100%',
        top: '40%',
        left: '50%',
        transform: 'translateX(-5.5%)',
      }}
    >
      <Space>
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </Space>
    </Space>
  );
};

export default Spinner;
