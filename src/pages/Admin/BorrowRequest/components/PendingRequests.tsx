import { useDetailModal } from '@/models/Admin/BorrowRequest/useDetailModal';
import { usePendingRequests } from '@/models/Admin/BorrowRequest/usePendingRequests';
import { useRejectModal } from '@/models/Admin/BorrowRequest/useRejectModal';
import { rejectBorrowRequest } from '@/services/Admin/borrowRequest';
import { PendingRequest } from '@/services/Admin/BorrowRequest/types';
import { Button, Input, message, Modal, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import AdminRequestDetail from './AdminRequestDetail';

const PendingRequests: React.FC = () => {
	const { loading, data, pagination, handleTableChange, handleApprove, fetchData } = usePendingRequests();

	const [rejectActionLoading, setRejectActionLoading] = useState(false);

	const {
		isRejectModalVisible,
		rejectReason,
		setRejectReason,
		currentRejectRequestId,
		showRejectModal,
		hideRejectModal,
	} = useRejectModal(() => fetchData(pagination.current, pagination.pageSize));

	const { showDetailModal, detailRequestId, handleViewDetail, handleCloseDetailModal } = useDetailModal(() =>
		fetchData(pagination.current, pagination.pageSize),
	);

	const handleCloseDetail = () => {
		handleCloseDetailModal();
		fetchData(pagination.current, pagination.pageSize);
	};

	const handleRejectConfirm = async () => {
		if (!rejectReason) {
			message.error('Vui lòng nhập lý do từ chối');
			return;
		}
		if (!currentRejectRequestId) {
			message.error('Không tìm thấy ID yêu cầu để từ chối');
			return;
		}

		setRejectActionLoading(true);
		try {
			await rejectBorrowRequest(currentRejectRequestId, rejectReason);
			message.success('Từ chối đơn mượn thành công');
			hideRejectModal();
		} catch (error: any) {
			message.error(error.response?.data?.message || 'Từ chối đơn mượn thất bại');
		} finally {
			setRejectActionLoading(false);
		}
	};

	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: '_id',
			key: '_id',
			width: 200,
			render: (text: string) => <Tag color='purple'>{text}</Tag>,
		},
		{
			title: 'Thiết bị',
			dataIndex: ['device', 'name'],
			key: 'device',
		},
		{
			title: 'Người mượn',
			dataIndex: ['user', 'name'],
			key: 'user',
		},
		{
			title: 'Ngày mượn',
			dataIndex: 'borrow_date',
			key: 'borrow_date',
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Ngày trả',
			dataIndex: 'return_date',
			key: 'return_date',
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => <Tag color='orange'>Chờ duyệt</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (text: any, record: PendingRequest) => (
				<span>
					<Button style={{ marginRight: 8 }} onClick={() => handleViewDetail(record._id)}>
						Chi tiết
					</Button>
					<Button type='primary' style={{ marginRight: 8 }} onClick={() => handleApprove(record._id)}>
						Duyệt
					</Button>
					<Button danger onClick={() => showRejectModal(record._id)}>
						Từ chối
					</Button>
				</span>
			),
		},
	];

	return (
		<>
			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				rowKey='_id'
				pagination={pagination}
				onChange={handleTableChange}
			/>
			<Modal
				title='Lý do từ chối'
				visible={isRejectModalVisible}
				onOk={handleRejectConfirm}
				onCancel={hideRejectModal}
				confirmLoading={rejectActionLoading}
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
			{showDetailModal && detailRequestId && (
				<Modal
					title='Chi tiết yêu cầu mượn'
					visible={showDetailModal}
					onCancel={handleCloseDetail}
					footer={null}
					width={900}
					centered
				>
					<AdminRequestDetail requestId={detailRequestId} onBack={handleCloseDetail} />
				</Modal>
			)}
		</>
	);
};

export default PendingRequests;
