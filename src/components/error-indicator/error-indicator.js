import React from 'react';
import { Alert, Space } from 'antd';

const ErrorIndicator = () => {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
      <Alert
        banner="false"
        message="Error"
        description="Sorry, looks like something went wrong. Already fixing."
        type="error"
        showIcon
      />
    </Space>
  );
};

export default ErrorIndicator;
