import { BorrowRequestState } from '@/models/Admin/BorrowRequest';
import { createBorrowRequestActions } from '@/models/Admin/BorrowRequest/actions';
import { BorrowingDevice } from '@/services/Admin/borrowRequest';
import { Button, Modal, Space, Table, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AdminRequestDetail from './AdminRequestDetail';

const ReturningRequests: React.FC = () => {
	const [state, setState] = useState<BorrowRequestState>({
		loading: false,
		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
		},
		showDetailModal: false,
		detailRequestId: null,
	});

	const actions = createBorrowRequestActions(state, setState);

	useEffect(() => {
		actions.fetchData();
	}, []);

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
			width: 300,
			render: (text: string, record: BorrowingDevice) => (
				<Space>
					<div>
						<div>{text}</div>
						<div style={{ fontSize: 12, color: '#666' }}>Mã: {record.device.code}</div>
					</div>
				</Space>
			),
		},
		{
			title: 'Người mượn',
			dataIndex: ['user', 'name'],
			key: 'user',
			width: 200,
			render: (text: string, record: BorrowingDevice) => (
				<div>
					<div>{text}</div>
					<div style={{ fontSize: 12, color: '#666' }}>{record.user.email}</div>
				</div>
			),
		},
		{
			title: 'S.lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			width: 70,
			render: (text: number) => <Tag color='blue'>{text}</Tag>,
		},
		{
			title: 'Ngày mượn',
			dataIndex: 'borrow_date',
			key: 'borrow_date',
			width: 80,
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Ngày trả',
			dataIndex: 'return_date',
			key: 'return_date',
			width: 80,
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			render: (_: unknown, record: BorrowingDevice) => (
				<Space>
					<Button onClick={() => actions.handleViewDetail(record._id)}>Chi tiết</Button>
					<Button type='primary' onClick={() => actions.handleConfirmReturn(record._id)}>
						Xác nhận trả
					</Button>
				</Space>
			),
		},
	];

	return (
		<>
			<Table
				columns={columns}
				dataSource={state.data}
				rowKey='_id'
				pagination={state.pagination}
				loading={state.loading}
				onChange={actions.handleTableChange}
			/>
			{state.showDetailModal && state.detailRequestId && (
				<Modal
					title='Chi tiết yêu cầu mượn'
					visible={state.showDetailModal}
					onCancel={actions.handleCloseDetailModal}
					footer={null}
					width={900}
					centered
				>
					<AdminRequestDetail requestId={state.detailRequestId} onBack={actions.handleCloseDetailModal} />
				</Modal>
			)}
		</>
	);
};

export default ReturningRequests;
