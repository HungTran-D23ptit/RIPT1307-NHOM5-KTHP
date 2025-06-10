import { API_URL } from '@/config/config';
import { useBorrowRequestDetailData } from '@/models/Admin/BorrowRequest/useBorrowRequestDetailData';
import { useStatusConfig } from '@/models/Admin/BorrowRequest/useStatusConfig';
import { AdminRequestDetailProps } from '@/services/Admin/BorrowRequest/types';
import {
	ArrowLeftOutlined,
	BoxPlotOutlined,
	CalendarOutlined,
	FileTextOutlined,
	PhoneOutlined,
} from '@ant-design/icons';
import { Button, Col, Divider, Input, Modal, Row, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';

const AdminRequestDetail: React.FC<AdminRequestDetailProps> = ({ requestId, onBack }) => {
	const {
		request,
		loading: detailDataLoading,
		actionLoading,
		isRejectModalVisible,
		rejectReason,
		setRejectReason,
		fetchRequestDetail,
		handleApprove,
		handleReject,
		handleRejectConfirm,
		handleRejectCancel,
		handleConfirmReturn,
	} = useBorrowRequestDetailData(requestId);

	const { getStatusTag } = useStatusConfig();

	useEffect(() => {
		fetchRequestDetail();
	}, [requestId]);

	if (detailDataLoading) {
		return <div>Đang tải chi tiết yêu cầu...</div>;
	}

	if (!request) {
		return null;
	}

	return (
		<div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
			<Button type='link' icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 16 }}>
				Quay lại
			</Button>
			<h2>Chi tiết yêu cầu #{request._id}</h2>
			<p style={{ color: '#6b7280', marginBottom: 24 }}>Thông tin chi tiết về yêu cầu mượn thiết bị</p>

			<Row gutter={24}>
				<Col span={16}>
					<div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 24 }}>
						<h3>
							<BoxPlotOutlined /> Thông tin thiết bị
						</h3>
						<Row gutter={16} style={{ marginTop: 16 }}>
							<Col span={6}>
								<div
									style={{
										width: '100%',
										height: 150,
										backgroundColor: '#f5f5f5',
										borderRadius: 8,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									{request.device?.image_url ? (
										<img
											src={`${API_URL}/static/${request.device.image_url}`}
											alt={request.device?.name || 'Thiết bị'}
											style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}
										/>
									) : (
										<span>Ảnh thiết bị</span>
									)}
								</div>
							</Col>
							<Col span={18}>
								<h4 style={{ fontWeight: 700 }}>{request.device?.name || 'Không có tên'}</h4>
								<p>
									<b>Loại:</b> {request.device?.type || 'Chưa có'}
								</p>
								<p>
									<b>Tình trạng: </b>
									<Tag style={getStatusTag(request.status)}>{getStatusTag(request.status).text}</Tag>
								</p>
								<p>
									<b>Mã thiết bị: </b>
									{request.device?.code || 'Chưa có'}
								</p>
							</Col>
						</Row>
					</div>

					<div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
						<h3>
							<FileTextOutlined /> Chi tiết yêu cầu
						</h3>
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
								<PhoneOutlined /> <b>Số điện thoại:</b> {request.user?.phone || 'Chưa có'}
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
									type='primary'
									onClick={() => handleApprove(onBack)}
									loading={actionLoading}
									style={{
										marginBottom: 8,
										borderRadius: 6,
									}}
								>
									Duyệt
								</Button>
								<Button
									block
									danger
									onClick={handleReject}
									loading={actionLoading}
									style={{
										marginBottom: 8,
										borderRadius: 6,
									}}
								>
									Từ chối
								</Button>
							</>
						)}
						{request.status === 'RETURNING' && (
							<Button
								block
								type='primary'
								onClick={() => handleConfirmReturn(onBack)}
								loading={actionLoading}
								style={{
									marginBottom: 8,
									borderRadius: 6,
								}}
							>
								Xác nhận trả
							</Button>
						)}
					</div>

					<div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
						<h3>Thông tin liên hệ</h3>
						<p>
							<b>Thiết bị quản lý phòng</b>
						</p>
						<p>Tầng 1, Tòa nhà chính</p>
						<p>Điện thoại: (024) 1234-5678</p>
						<p>Email: equipment@university.edu.vn</p>
						<Divider />
						<p>
							<b>Giờ làm việc</b>
						</p>
						<p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
						<p>Thứ 7: 8:00 - 12:00</p>
					</div>
				</Col>
			</Row>
			<Modal
				title='Lý do từ chối'
				visible={isRejectModalVisible}
				onOk={() => handleRejectConfirm(onBack)}
				onCancel={handleRejectCancel}
				confirmLoading={actionLoading}
				okText='Xác nhận từ chối'
				cancelText='Hủy'
			>
				<p>Vui lòng nhập lý do từ chối</p>
				<Input.TextArea
					rows={4}
					value={rejectReason}
					onChange={(e) => setRejectReason(e.target.value)}
					placeholder='Nhập lý do từ chối...'
				/>
			</Modal>
		</div>
	);
};

export default AdminRequestDetail;
