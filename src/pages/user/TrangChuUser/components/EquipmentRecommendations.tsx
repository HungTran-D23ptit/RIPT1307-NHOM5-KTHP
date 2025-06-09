import { Row, Col, Card, Button} from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { RecommendedDevice } from '@/services/User/Home/typing';
import { useHistory } from 'react-router-dom';
import { API_URL } from '../../../../config/config';
import './EquipmentRecommendations.less';

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
        className={`star ${i < Math.floor(rating) ? 'active' : 'inactive'}`}
      />
    ));
  };

  return (
    <div className="equipment-recommendations">
      <Row justify="space-between" className="header">
        <Col>
          <h2 className="title">
            <StarOutlined className="icon" />
            Thiết bị đề xuất cho bạn
          </h2>
        </Col>
        <Col>
          <Button type="link" onClick={() => history.push('devices')}>Xem tất cả</Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {recommendations.map((item) => (
          <Col xs={12} sm={6} key={item.id}>
            <Card hoverable className="recommendation-card">
              <div className="image-container">
                <img 
                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}/static/${item.imageUrl}`} 
                  alt={item.name}
                />
              </div>
              <Meta 
                title={<h3 className="device-name">{item.name}</h3>} 
                description={<p className="device-code">Mã: {item.code}</p>} 
              />
              <div className="rating">
                {renderStars(4.5)}
                <span className="rating-value">(4.5)</span>
              </div>
              <p className={`availability ${item.quantity > 0 ? 'available' : 'unavailable'}`}>
                {item.quantity > 0 ? `Còn ${item.quantity} sẵn có` : 'Hết hàng'}
              </p>
              <Button
                block
                size="small"
                className={`borrow-button ${item.quantity > 0 ? 'available' : 'unavailable'}`}
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
