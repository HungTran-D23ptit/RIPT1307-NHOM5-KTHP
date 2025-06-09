import { useEffect, useState } from 'react';
import { Row, Col, Button, Tag, Divider, message, Modal, Input } from 'antd';
import { ArrowLeftOutlined, PhoneOutlined, FileTextOutlined, CalendarOutlined, BoxPlotOutlined } from '@ant-design/icons';
import { API_URL } from '@/config/config';
import { getBorrowRequestDetail, approveBorrowRequest, rejectBorrowRequest, BorrowingDevice as BorrowRequest, confirmReturnDevice } from '@/services/Admin/borrowRequest';
import moment from 'moment';

// Define props for AdminRequestDetail
interface AdminRequestDetailProps {
    requestId: string;
    onBack: () => void;
}

const AdminRequestDetail: React.FC<AdminRequestDetailProps> = ({ requestId, onBack }) => {
    const [request, setRequest] = useState<BorrowRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        const fetchRequestDetail = async () => {
            try {
                const response = await getBorrowRequestDetail(requestId);
                setRequest(response.data);
            } catch (error) {
                message.error('Không thể tải thông tin chi tiết yêu cầu mượn');
            }
        };
        fetchRequestDetail();
    }, [requestId]);

    const handleApprove = () => {
        Modal.confirm({
            title: 'Xác nhận duyệt yêu cầu',
            content: 'Bạn có chắc chắn muốn duyệt yêu cầu mượn này không?',
            okText: 'Xác nhận',
            cancelText: 'Đóng',
            onOk: async () => {
                setLoading(true);
                try {
                    await approveBorrowRequest(requestId);
                    message.success('Duyệt đơn mượn thành công');
                    onBack();
                } catch (error: any) {
                    message.error(error.response?.data?.message || 'Duyệt đơn mượn thất bại');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleReject = () => {
        setIsRejectModalVisible(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectReason) {
            message.error('Vui lòng nhập lý do từ chối');
            return;
        }
        setLoading(true);
        try {
            await rejectBorrowRequest(requestId, rejectReason);
            message.success('Từ chối đơn mượn thành công');
            setIsRejectModalVisible(false);
            setRejectReason('');
            onBack();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Từ chối đơn mượn thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectCancel = () => {
        setIsRejectModalVisible(false);
        setRejectReason('');
    };

    const handleConfirmReturn = async () => {
        setLoading(true);
        try {
            await confirmReturnDevice(requestId);
            message.success('Xác nhận trả thiết bị thành công');
            onBack(); // Go back to the list after successful confirmation
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Xác nhận trả thiết bị thất bại');
        } finally {
            setLoading(false);
        }
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

    const getStatusTag = (status: keyof typeof statusConfig) => {
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
                                    {getStatusTag(request.status as keyof typeof statusConfig)}
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
                            <>
                                <Button
                                    block
                                    type="primary"
                                    onClick={handleApprove}
                                    loading={loading}
                                    style={{
                                        marginBottom: 8,
                                        borderRadius: 6
                                    }}
                                >
                                    Duyệt
                                </Button>
                                <Button
                                    block
                                    danger
                                    onClick={handleReject}
                                    loading={loading}
                                    style={{
                                        marginBottom: 8,
                                        borderRadius: 6
                                    }}
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}
                        {request.status === 'RETURNING' && (
                            <Button
                                block
                                type="primary"
                                onClick={handleConfirmReturn}
                                loading={loading}
                                style={{
                                    marginBottom: 8,
                                    borderRadius: 6
                                }}
                            >
                                Xác nhận trả
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
            <Modal
                title="Lý do từ chối"
                visible={isRejectModalVisible}
                onOk={handleRejectConfirm}
                onCancel={handleRejectCancel}
                confirmLoading={loading}
                okText="Xác nhận từ chối"
                cancelText="Hủy"
            >
                <p>Vui lòng nhập lý do từ chối</p>
                <Input.TextArea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                />
            </Modal>
        </div>
    );
};

export default AdminRequestDetail; 