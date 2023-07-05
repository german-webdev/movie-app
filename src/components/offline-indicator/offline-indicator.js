import React from 'react';
import { Alert, Space } from 'antd';

const OfflineIndicator = () => {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
      <Alert
        banner
        message="No Internet Connection"
        description="Please check your internet connection and try again."
        type="error"
        showIcon
      />
    </Space>
  );
};

export default OfflineIndicator;
