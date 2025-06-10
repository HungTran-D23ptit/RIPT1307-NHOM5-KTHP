import { Row, Col, Card } from 'antd';
import { PlusOutlined, ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import './QuickActions.less';

const QuickActions = () => {
  const history = useHistory();

  const actions = [
    {
      icon: <ShoppingCartOutlined className="icon" />,
      title: 'Thiết bị',
      description: 'Tìm và mượn thiết bị',
      type: 'devices',
      path: '/user/devices'
    },
    {
      icon: <ClockCircleOutlined className="icon" />,
      title: 'Yêu cầu của tôi',
      description: 'Xem trạng thái yêu cầu',
      type: 'requests',
      path: '/user/borrow-requests'
    },
    {
      icon: <CheckCircleOutlined className="icon" />,
      title: 'Lịch sử',
      description: 'Xem lịch sử mượn',
      type: 'history',
      path: '/user/borrowed-history'
    },
    {
      icon: <UserOutlined className="icon" />,
      title: 'Hồ sơ',
      description: 'Quản lý thông tin',
      type: 'profile',
      path: '/user/profile'
    }
  ];

  return (
    <div className="quick-actions">
      <h2 className="title">
        <PlusOutlined className="icon" />
        <span>Hành động nhanh</span>
      </h2>
      <Row gutter={[16, 16]}>
        {actions.map((action, index) => (
          <Col xs={12} sm={12} lg={6} key={index}>
            <Card 
              hoverable 
              className="action-card"
              onClick={() => history.push(action.path)}
            >
              <div className="action-content">
                <div className={`icon-circle ${action.type}`}>
                  {action.icon}
                </div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuickActions; 