import React from 'react';
import { Typography } from 'antd';
import { useWelcomeHeader } from '@/models/User/Home/WelcomeHeader';
import './WelcomeHeader.less';

const { Title, Text } = Typography;

const WelcomeHeader: React.FC = () => {
  const { userName } = useWelcomeHeader();

  return (
    <div className="welcome-header">
      <Title level={2} className="title">Xin chào {userName || '...'}</Title>
      <Text type="secondary" className="subtitle">Chào mừng bạn đến với hệ thống quản lý thiết bị</Text>
    </div>
  );
};

export default WelcomeHeader;