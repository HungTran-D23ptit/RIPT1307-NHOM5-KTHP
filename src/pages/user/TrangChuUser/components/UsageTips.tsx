import { Row, Col, Card } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

const UsageTips = () => {
  return (
    <Card style={{ background: 'linear-gradient(to bottom right, #fff5f7, #ffe4e6)', border: '1px solid #ffe4e6', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <BulbOutlined style={{ marginRight: '8px' }} />
        Mẹo sử dụng hiệu quả
      </h2>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', background: '#ffe4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
              <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>1</span>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ff4d4f', marginBottom: '4px' }}>Đặt trước</h4>
              <p style={{ color: '#ff4d4f' }}>Đặt trước thiết bị để đảm bảo có sẵn khi cần</p>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', background: '#ffe4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
              <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>2</span>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ff4d4f', marginBottom: '4px' }}>Kiểm tra</h4>
              <p style={{ color: '#ff4d4f' }}>Kiểm tra tình trạng thiết bị trước khi nhận</p>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', background: '#ffe4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
              <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>3</span>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ff4d4f', marginBottom: '4px' }}>Trả đúng hạn</h4>
              <p style={{ color: '#ff4d4f' }}>Trả đúng hạn để tránh bị phạt và giúp người khác</p>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default UsageTips; 