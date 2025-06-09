import { Row, Col, Card } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import './UsageTips.less';

const UsageTips = () => {
  return (
    <Card className="usage-tips">
      <h2 className="title">
        <BulbOutlined className="icon" />
        Mẹo sử dụng hiệu quả
      </h2>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div className="tip-item">
            <div className="number-circle">
              <span>1</span>
            </div>
            <div className="content">
              <h4>Đặt trước</h4>
              <p>Đặt trước thiết bị để đảm bảo có sẵn khi cần</p>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="tip-item">
            <div className="number-circle">
              <span>2</span>
            </div>
            <div className="content">
              <h4>Kiểm tra</h4>
              <p>Kiểm tra tình trạng thiết bị trước khi nhận</p>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="tip-item">
            <div className="number-circle">
              <span>3</span>
            </div>
            <div className="content">
              <h4>Trả đúng hạn</h4>
              <p>Trả đúng hạn để tránh bị phạt và giúp người khác</p>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default UsageTips; 