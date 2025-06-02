import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { getDeviceById } from '@/services/User/Device';
import { createBorrowRequest } from '@/services/User/BorrowRequest';
import { message, Input, DatePicker, InputNumber, Button, Card, Row, Col } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './/BorrowRequest.less';

const BorrowRequest = () => {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [borrowDate, setBorrowDate] = useState<any>(null);
  const [returnDate, setReturnDate] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('Device ID from URL:', id);
  useEffect(() => {
    getDeviceById(id).then(res => setDevice(res.data)).catch(() => message.error('Không thể tải thông tin thiết bị'));
  }, [id]);

  const handleSubmit = async () => {
    if (!borrowDate || !returnDate || !reason) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    console.log('Submitting borrow request for device ID:', id);
    try {
      const res = await createBorrowRequest(id, {
        quantity,
        borrow_date: borrowDate.toISOString(),
        return_date: returnDate.toISOString(),
        reason,
      });
      message.success('Tạo đơn mượn thành công');
      history.push('/user/borrow-requests');
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Tạo đơn mượn thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="borrow-request-container">
      <a onClick={() => history.goBack()} className="back-link">{'<-- Quay lại danh sách thiết bị'}</a>
      <Card className="borrow-request-card">
        <h2 className="page-title">Mượn <span className="device-name">{device?.name}</span></h2>
        <div className="page-subtitle">Điền vào biểu mẫu bên dưới để yêu cầu thiết bị này.</div>
        <Row gutter={32}>
          <Col span={10}>
            <Card className="device-detail-card">
              <img src={device?.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} alt={device?.name} />
              <div className="device-name-bold">{device?.name}</div>
              <div className="device-type">{device?.type}</div>
              <div className="device-quantity">Có sẵn: <b>{device?.quantity}</b></div>
            </Card>
          </Col>
          <Col span={14}>
            <Card className="form-card">
              <div style={{ marginBottom: 12 }}>
                <label>Start Date</label>
                <DatePicker
                  value={borrowDate}
                  onChange={setBorrowDate}
                  format="DD/MM/YYYY"
                  disabledDate={d => d && d < moment().startOf('day')}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>End Date</label>
                <DatePicker
                  value={returnDate}
                  onChange={setReturnDate}
                  format="DD/MM/YYYY"
                  disabledDate={d => borrowDate ? d && d < moment(borrowDate).startOf('day') : d && d < moment().startOf('day')}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Số lượng</label>
                <InputNumber
                  min={1}
                  max={device?.quantity || 1}
                  value={quantity}
                  onChange={setQuantity}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Mục đích sử dụng</label>
                <Input.TextArea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  maxLength={255}
                  placeholder="Nhập mục đích sử dụng"
                />
              </div>
              <Row justify="end" className="form-actions">
                <Col>
                  <Button onClick={() => history.goBack()}>Cancel</Button>
                </Col>
                <Col>
                  <Button type="primary" loading={loading} onClick={handleSubmit}>Gửi yêu cầu</Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BorrowRequest; 