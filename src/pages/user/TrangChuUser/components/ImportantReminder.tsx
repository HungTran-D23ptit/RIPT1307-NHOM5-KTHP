import { Row, Col, Card, Button } from 'antd';
import { useImportantReminder } from '@/models/User/Home/ImportantReminder';
import './ImportantReminder.less';

const ImportantReminderComponent = () => {
  const { reminders } = useImportantReminder();

  if (reminders.length === 0) {
    return null;
  }

  return (
    <Card className="important-reminder">
      <Row justify="space-between">
        <Col className="reminder-content">
          <h3 className="title">Nhắc nhở quan trọng</h3>
          <p className="message">
            Bạn có {reminders.length} thiết bị cần trả hôm nay: {reminders.map(r => r.deviceName).join(', ')}. 
            Hãy chuẩn bị trả đúng hạn!
          </p>
        </Col>
        <Col>
          <Button type="primary" className="support-button">Liên hệ hỗ trợ</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ImportantReminderComponent; 