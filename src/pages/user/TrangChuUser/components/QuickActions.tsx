import { Row, Col, Card } from 'antd';
import { PlusOutlined, ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const QuickActions = () => {
  const history = useHistory();

  const actions = [
    {
      icon: <ShoppingCartOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />,
      title: 'Thiết bị',
      description: 'Tìm và mượn thiết bị',
      bgColor: '#ffe4e6',
      path: '/user/devices'
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      title: 'Yêu cầu của tôi',
      description: 'Xem trạng thái yêu cầu',
      bgColor: '#e6f4ff',
      path: '/user/borrow-requests'
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      title: 'Lịch sử',
      description: 'Xem lịch sử mượn',
      bgColor: '#f6ffed',
      path: '/user/borrowed-history'
    },
    {
      icon: <UserOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      title: 'Hồ sơ',
      description: 'Quản lý thông tin',
      bgColor: '#f0e7ff',
      path: '/user/profile'
    }
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <PlusOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
        <span>Hành động nhanh</span>
      </h2>
      <Row gutter={[16, 16]}>
        {actions.map((action, index) => (
          <Col xs={12} sm={12} lg={6} key={index}>
            <Card 
              hoverable 
              style={{ border: '1px solid #d9d9d9', borderRadius: '8px', transition: 'all 0.3s', cursor: 'pointer' }}
              onClick={() => history.push(action.path)}
            >
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: action.bgColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  {action.icon}
                </div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '2px' }}>{action.title}</h3>
                <p style={{ color: '#666', fontSize: '12px' }}>{action.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuickActions; 