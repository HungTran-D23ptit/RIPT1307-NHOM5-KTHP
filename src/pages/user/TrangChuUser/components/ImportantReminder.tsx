import { Row, Col, Card, Button } from 'antd';
import { useImportantReminder } from '@/models/User/Home/ImportantReminder';
const ImportantReminderComponent = () => {
  const { reminders } = useImportantReminder();

  if (reminders.length === 0) {
    return null;
  }

  return (
    <Card style={{ marginTop: '16px', background: '#e6f7ff', border: '1px solid #b3e0ff', borderRadius: '8px' }}>
      <Row justify="space-between">
        <Col>
          <h3 style={{ fontWeight: 'bold', color: '#1890ff' }}>Nhắc nhở quan trọng</h3>
          <p style={{ color: '#1890ff' }}>
            Bạn có {reminders.length} thiết bị cần trả hôm nay: {reminders.map(r => r.deviceName).join(', ')}. 
            Hãy chuẩn bị trả đúng hạn!
          </p>
        </Col>
        <Col>
          <Button type="primary" style={{ background: '#1890ff', borderColor: '#1890ff' }}>Liên hệ hỗ trợ</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ImportantReminderComponent; 