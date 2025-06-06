import { Button, Card, Badge, Row, Col, Modal, message } from 'antd';
import moment from 'moment';
import type { RequestCardProps } from '@/services/User/AllRequest/FEtyping';
import { STATUS_CONFIG } from '@/models/User/AllRequest/constants';
import { handleCancelRequest, handleRequestExtension, handleRecreateRequest } from '@/models/User/AllRequest/requestCard';
import { requestReturnDevice } from '@/services/User/AllRequest';

const RequestCard = ({ item, onViewDetail, onRequestUpdate }: RequestCardProps) => {
    const handleReturnDevice = () => {
        Modal.confirm({
            title: 'Xác nhận trả thiết bị',
            content: 'Bạn có chắc chắn muốn trả thiết bị này không?',
            okText: 'Xác nhận',
            cancelText: 'Đóng',
            onOk: async () => {
                try {
                    await requestReturnDevice(item._id);
                    message.success('Yêu cầu trả thiết bị đã được gửi');
                    onRequestUpdate?.();
                } catch (error: any) {
                    message.error(error.response?.data?.message || 'Không thể gửi yêu cầu trả thiết bị');
                }
            }
        });
    };

    return (
        <Card
            hoverable
            style={{
                borderRadius: 8,
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0',
            }}
            bodyStyle={{ padding: 16 }}
        >
            <div style={{ marginBottom: 16 }}>
                <Row justify="space-between" align="middle">
                    <Col flex="auto">                        
                        <h3 style={{
                            margin: 0,
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#262626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            {item.device.name}
                            <Badge
                                count={STATUS_CONFIG[item.status].text}
                                style={{
                                    backgroundColor: STATUS_CONFIG[item.status].bgColor,
                                    borderRadius: 12,
                                    padding: '0 12px',
                                    height: 'auto',
                                    minHeight: 24,
                                    lineHeight: '22px',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: '#fff',
                                }}
                            />
                        </h3>
                    </Col>
                </Row>
            </div>

            <div style={{ fontSize: 14, color: '#595959' }}>
                <Row gutter={[16, 8]}>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c8c8c' }}>Ngày yêu cầu:</span>
                        <span style={{ fontWeight: 500 }}>{moment(item.created_at).format('DD/MM/YYYY')}</span>
                    </Col>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c8c8c' }}>Ngày mượn:</span>
                        <span style={{ fontWeight: 500 }}>{moment(item.borrow_date).format('DD/MM/YYYY')}</span>
                    </Col>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c8c8c' }}>Ngày trả:</span>
                        <span style={{ fontWeight: 500 }}>{moment(item.return_date).format('DD/MM/YYYY')}</span>
                    </Col>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c8c8c' }}>Số lượng:</span>
                        <span style={{ fontWeight: 500 }}>{item.quantity}</span>
                    </Col>
                </Row>

                {item.status === 'REJECTED' && item.note && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <div style={{ color: '#8c8c8c' }}>Lý do từ chối:</div>
                        <div style={{ color: '#ef4444', fontWeight: 500 }}>{item.note}</div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 16 }}>
                <Row gutter={8}>
                    <Col flex="1">
                        <Button
                            block
                            type="primary"
                            onClick={() => onViewDetail(item)}
                            style={{ borderRadius: 6 }}
                        >
                            Chi tiết
                        </Button>
                    </Col>
                    <Col flex="1">
                        {item.status === 'PENDING' && (
                            <Button
                                block
                                onClick={() => handleCancelRequest(item, onRequestUpdate)}
                                style={{ 
                                    borderRadius: 6,
                                    borderColor: STATUS_CONFIG.PENDING.bgColor,
                                    color: STATUS_CONFIG.PENDING.bgColor
                                }}
                            >
                                Hủy yêu cầu
                            </Button>
                        )}
                        {(item.status === 'APPROVED' || item.status === 'RETURNING') && (
                            <Button
                                block
                                onClick={handleReturnDevice}
                                style={{ 
                                    borderRadius: 6,
                                    borderColor: STATUS_CONFIG.APPROVED.bgColor,
                                    color: STATUS_CONFIG.APPROVED.bgColor
                                }}
                            >
                                Trả thiết bị
                            </Button>
                        )}
                        {item.status === 'REJECTED' && (
                            <Button
                                block
                                onClick={() => handleRecreateRequest(item, onRequestUpdate)}
                                style={{ 
                                    borderRadius: 6,
                                    borderColor: STATUS_CONFIG.REJECTED.bgColor,
                                    color: STATUS_CONFIG.REJECTED.bgColor
                                }}
                            >
                                Tạo lại
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default RequestCard;