import { useEffect, useState } from 'react';
import { Row, Col, Button, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, PhoneOutlined, FileTextOutlined, CalendarOutlined, BoxPlotOutlined } from '@ant-design/icons';
import { API_URL } from '@/config/config';
import type { BorrowRequest, RequestDetailProps } from '@/services/User/AllRequest/FEtyping';
import { STATUS_CONFIG, CONTACT_INFO } from '@/models/User/AllRequest/constants';
import { fetchRequestDetail, handleRequestExtension, handleCancelRequest } from '@/models/User/AllRequest/requestDetail';
import moment from 'moment';

const RequestDetail: React.FC<RequestDetailProps> = ({ requestId, onBack }) => {
    const [request, setRequest] = useState<BorrowRequest | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadRequestDetail = async () => {
            const data = await fetchRequestDetail(requestId);
            setRequest(data);
        };
        loadRequestDetail();
    }, [requestId]);

    if (!request) {
        return null;
    }

    const getStatusTag = (status: BorrowRequest['status']) => {
        return (
            <Tag 
                style={{
                    backgroundColor: STATUS_CONFIG[status]?.bgColor || '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '2px 12px',
                    height: 24,
                    lineHeight: '20px',
                    fontSize: 12,
                    fontWeight: 500,
                }}
            >
                {STATUS_CONFIG[status]?.text || status}
            </Tag>
        );
    };

    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 16 }}>
                Quay lại
            </Button>
            <h2>Chi tiết yêu cầu #{request._id}</h2>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Thông tin chi tiết về yêu cầu mượn thiết bị</p>

            <Row gutter={24}>
                <Col span={16}>
                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <h3><BoxPlotOutlined /> Thông tin thiết bị</h3>
                        <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={6}>
                                <div style={{ width: '100%', height: 200, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {request.device.image_url ? (
                                        <img 
                                            src={`${API_URL}/static/${request.device.image_url}`} 
                                            alt={request.device.name} 
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} 
                                        />
                                    ) : (
                                        <span>Ảnh thiết bị</span>
                                    )}
                                </div>
                            </Col>
                            <Col span={18}>
                                <h4 style={{ fontWeight: 700 }}>{request.device.name}</h4>
                                <p><b>Loại:</b> {request.device.type || 'Chưa có'}</p>
                                <p><b>Tình trạng: </b> 
                                    {getStatusTag(request.status)}
                                </p>
                                <p><b>Mã thiết bị: </b>{request.device.code}</p>
                            </Col>
                        </Row>
                    </div>

                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
                        <h3><FileTextOutlined /> Chi tiết yêu cầu</h3>
                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                            <Col span={12}>
                                <CalendarOutlined /> <b>Ngày mượn:</b> {moment(request.borrow_date).format('DD/MM/YYYY')}
                            </Col>
                            <Col span={12}>
                                <CalendarOutlined /> <b>Ngày trả:</b> {moment(request.return_date).format('DD/MM/YYYY')}
                            </Col>
                            <Col span={12}>
                                <BoxPlotOutlined /> <b>Số lượng:</b> {request.quantity}
                            </Col>
                            <Col span={12}>
                                <PhoneOutlined /> <b>Số điện thoại:</b> {request.user.phone || 'Chưa có'}
                            </Col>
                            <Col span={24}>
                                <FileTextOutlined /> <b>Mục đích sử dụng:</b> {request.reason || 'Chưa có'}
                            </Col>
                            {request.status === 'REJECTED' && request.note && (
                                <Col span={24}>
                                    <FileTextOutlined /> <b>Lý do từ chối:</b> <span style={{ color: '#ff4d4f' }}>{request.note}</span>
                                </Col>
                            )}
                        </Row>
                    </div>
                </Col>

                <Col span={8}>                    
                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <h3>Hành động</h3>
                        {request.status === 'PENDING' && (
                            <Button 
                                block 
                                onClick={() => handleCancelRequest(requestId, onBack)} 
                                loading={loading} 
                                style={{ 
                                    marginBottom: 8,
                                    borderColor: STATUS_CONFIG.PENDING.bgColor,
                                    color: STATUS_CONFIG.PENDING.bgColor,
                                    borderRadius: 6
                                }}
                            >
                                Hủy yêu cầu
                            </Button>
                        )}
                        {request.status === 'APPROVED' && (
                            <>
                                <Button 
                                    block 
                                    onClick={handleRequestExtension}
                                    style={{ 
                                        marginBottom: 8,
                                        borderColor: STATUS_CONFIG.APPROVED.bgColor,
                                        color: STATUS_CONFIG.APPROVED.bgColor,
                                        borderRadius: 6
                                    }}
                                >
                                    Gia hạn
                                </Button>
                            </>
                        )}
                    </div>

                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
                        <h3>Thông tin liên hệ</h3>
                        <p><b>{CONTACT_INFO.title}</b></p>
                        <p>{CONTACT_INFO.address}</p>
                        <p>Điện thoại: {CONTACT_INFO.phone}</p>
                        <p>Email: {CONTACT_INFO.email}</p>
                        <Divider />
                        <p><b>Giờ làm việc</b></p>
                        <p>{CONTACT_INFO.workingHours.weekdays}</p>
                        <p>{CONTACT_INFO.workingHours.saturday}</p>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RequestDetail;
