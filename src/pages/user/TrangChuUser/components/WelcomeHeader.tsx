import React from 'react';
import { Typography } from 'antd';
import { useWelcomeHeader } from '@/models/User/Home/WelcomeHeader';

const { Title, Text } = Typography;

const WelcomeHeader: React.FC = () => {
  const { userName } = useWelcomeHeader();

  return (
    <div style={{ marginBottom: '24px' }}>
      <Title level={2}>Xin chào {userName || '...'}</Title>
      <Text type="secondary">Chào mừng bạn đến với hệ thống quản lý thiết bị</Text>
    </div>
  );
};

export default WelcomeHeader;