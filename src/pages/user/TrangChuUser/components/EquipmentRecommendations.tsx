import { Row, Col, Card, Button} from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { RecommendedDevice } from '@/services/User/Home/typing';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../../../config/config';

const { Meta } = Card;

const EquipmentRecommendations = () => {
  const history = useHistory();
  const [recommendations, setRecommendations] = useState<RecommendedDevice[]>([]);

  useEffect(() => {
    console.log('EquipmentRecommendations mounted');
    const fetchRecommendations = async () => {
      try {
        console.log('Fetching recommended devices...');
        const data = await HomeService.getRecommendedDevices();
        console.log('Recommended devices:', data);
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleBorrow = (deviceId: string) => {
    history.push(`/user/devices/${deviceId}/borrow-requests`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarOutlined 
        key={i} 
        style={{ 
          color: i < Math.floor(rating) ? '#faad14' : '#d9d9d9', 
          marginRight: '2px' 
        }} 
      />
    ));
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <Row justify="space-between" style={{ marginBottom: '16px' }}>
        <Col>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <StarOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
            Thiết bị đề xuất cho bạn
          </h2>
        </Col>
        <Col>
          <Button type="link" onClick={() => history.push('user/devices')}>Xem tất cả</Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {recommendations.map((item) => (
          <Col xs={12} sm={6} key={item.id}>
            <Card hoverable style={{ borderRadius: '8px', transition: 'all 0.3s' }}>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <img 
                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}/static/${item.imageUrl}`} 
                  alt={item.name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                
              </div>
              <Meta 
                title={<h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h3>} 
                description={<p style={{ color: '#666' }}>Mã: {item.code}</p>} 
              />
              <div style={{ margin: '8px 0' }}>
                {renderStars(4.5)}
                <span style={{ color: '#666', fontSize: '12px' }}>(4.5)</span>
              </div>
              <p style={{ color: item.quantity > 0 ? '#52c41a' : '#ff4d4f', fontSize: '12px', marginBottom: '8px' }}>
                {item.quantity > 0 ? `Còn ${item.quantity} sẵn có` : 'Hết hàng'}
              </p>
              <Button
                block
                size="small"
                style={{ background: item.quantity > 0 ? '#ff4d4f' : '#d9d9d9', borderColor: item.quantity > 0 ? '#ff4d4f' : '#d9d9d9', color: '#fff' }}
                disabled={item.quantity === 0}
                onClick={() => handleBorrow(item.id)}
              >
                {item.quantity > 0 ? 'Mượn ngay' : 'Hết hàng'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EquipmentRecommendations;
