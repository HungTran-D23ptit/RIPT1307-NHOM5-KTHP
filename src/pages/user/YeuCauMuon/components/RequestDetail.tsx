import { useEffect, useState } from 'react';
import { Row, Col, Button, Tag, Divider, message, Modal } from 'antd';
import { ArrowLeftOutlined, PhoneOutlined, FileTextOutlined, CalendarOutlined, BoxPlotOutlined } from '@ant-design/icons';
import { API_URL } from '@/config/config';
import { getBorrowRequestDetail, cancelBorrowRequest, requestReturnDevice } from '@/services/User/AllRequest';
import type { BorrowRequest } from '@/services/User/AllRequest/typing.d';
import type { RequestDetailProps } from '@/services/User/AllRequest/FEtyping';
import { handleRecreateRequest } from '@/models/User/AllRequest/requestCard';
import moment from 'moment';

const RequestDetail: React.FC<RequestDetailProps> = ({ requestId, onBack }) => {
    const [request, setRequest] = useState<BorrowRequest | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRequestDetail = async () => {
            try {
                const response = await getBorrowRequestDetail(requestId);
                setRequest(response);
            } catch (error) {
                message.error('Không thể tải thông tin chi tiết yêu cầu mượn');
            }
        };
        fetchRequestDetail();
    }, [requestId]);

    const handleRequestExtension = () => {
        Modal.info({
            title: 'Yêu cầu gia hạn',
            content: 'Vui lòng liên hệ trực tiếp với quản lý thiết bị để được hướng dẫn thủ tục gia hạn.',
            okText: 'Đã hiểu',
        });
    };

    const handleCancelRequest = () => {
        Modal.confirm({
            title: 'Xác nhận hủy yêu cầu',
            content: 'Bạn có chắc chắn muốn hủy yêu cầu mượn này không?',
            okText: 'Xác nhận',
            cancelText: 'Đóng',
            onOk: async () => {
                setLoading(true);
                try {
                    await cancelBorrowRequest(requestId);
                    message.success('Hủy yêu cầu mượn thành công');
                    onBack();
                } catch (error: any) {
                    message.error(error.response?.data?.message || 'Không thể hủy yêu cầu mượn');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleReturnDevice = () => {
        Modal.confirm({
            title: 'Xác nhận trả thiết bị',
            content: 'Bạn có chắc chắn muốn trả thiết bị này không?',
            okText: 'Xác nhận',
            cancelText: 'Đóng',
            onOk: async () => {
                setLoading(true);
                try {
                    await requestReturnDevice(requestId);
                    message.success('Yêu cầu trả thiết bị đã được gửi');
                    onBack();
                } catch (error: any) {
                    message.error(error.response?.data?.message || 'Không thể gửi yêu cầu trả thiết bị');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (!request) {
        return null;
    }

    const statusConfig = {
        PENDING: { color: '#fff', text: 'Chờ duyệt', bgColor: '#f18c1a' },
        APPROVED: { color: '#fff', text: 'Đã duyệt', bgColor: '#1bb955' },
        REJECTED: { color: '#fff', text: 'Đã từ chối', bgColor: '#ef4444' },
        CANCELLED: { color: '#fff', text: 'Đã hủy', bgColor: '#6b7280' },
        RETURNING: { color: '#fff', text: 'Đang trả', bgColor: '#3b82f6' },
        RETURNED: { color: '#fff', text: 'Đã trả', bgColor: '#10b981' },
        OVERDUE: { color: '#fff', text: 'Quá hạn', bgColor: '#dc2626' },
    } as const;

    const getStatusTag = (status: BorrowRequest['status']) => {
        return (
            <Tag 
                style={{
                    backgroundColor: statusConfig[status]?.bgColor || '#6b7280',
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
                {statusConfig[status]?.text || status}
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
                                <div style={{ width: '100%', height: 150, backgroundColor: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {request.device.image_url ? (
                                        <img 
                                            src={request.device.image_url.startsWith('http') 
                                                ? request.device.image_url 
                                                : `${API_URL}/static/${request.device.image_url}`} 
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
                            {request.note && (
                                <Col span={24}>
                                    <FileTextOutlined /> <b>Lý do từ chối: </b> <span style={{ color: '#ff4d4f' }}>{request.note}</span>
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
                                onClick={handleCancelRequest} 
                                loading={loading} 
                                style={{ 
                                    marginBottom: 8,
                                    borderColor: statusConfig.PENDING.bgColor,
                                    color: statusConfig.PENDING.bgColor,
                                    borderRadius: 6
                                }}
                            >
                                Hủy yêu cầu
                            </Button>
                        )}
                        {(request.status === 'APPROVED' || request.status === 'RETURNING') && (
                            <Button
                                block
                                onClick={handleReturnDevice}
                                loading={loading}
                                style={{ 
                                    marginBottom: 8,
                                    borderColor: statusConfig.APPROVED.bgColor,
                                    color: statusConfig.APPROVED.bgColor,
                                    borderRadius: 6
                                }}
                            >
                                Trả thiết bị
                            </Button>
                        )}
                        {request.status === 'REJECTED' && (
                            <Button
                                block
                                onClick={() => handleRecreateRequest(request, onBack)}
                                style={{ 
                                    marginBottom: 8,
                                    borderColor: statusConfig.REJECTED.bgColor,
                                    color: statusConfig.REJECTED.bgColor,
                                    borderRadius: 6
                                }}
                            >
                                Tạo lại
                            </Button>
                        )}
                    </div>

                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
                        <h3>Thông tin liên hệ</h3>
                        <p><b>Thiết bị quản lý phòng</b></p>
                        <p>Tầng 1, Tòa nhà chính</p>
                        <p>Điện thoại: (024) 1234-5678</p>
                        <p>Email: equipment@university.edu.vn</p>
                        <Divider />
                        <p><b>Giờ làm việc</b></p>
                        <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                        <p>Thứ 7: 8:00 - 12:00</p>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RequestDetail;
