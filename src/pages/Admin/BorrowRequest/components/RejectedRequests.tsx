import { useRejectedRequests } from '@/models/Admin/BorrowRequest/useRejectedRequests';
import { RejectedRequest } from '@/services/Admin/BorrowRequest/types';
import { Table, Tag } from 'antd';
import moment from 'moment';
import React from 'react';

const RejectedRequests: React.FC = () => {
	const { loading, data, pagination, handleTableChange } = useRejectedRequests();

	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: '_id',
			key: '_id',
			width: 200,
			render: (text: string) => <Tag color='purple'>{text}</Tag>,
		},
		{
			title: 'Đơn vị',
			dataIndex: ['user', 'name'],
			key: 'user',
		},
		{
			title: 'Thiết bị',
			dataIndex: ['device', 'name'],
			key: 'device',
		},
		{
			title: 'Ngày yêu cầu',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
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
			render: (status: string) => <Tag color='red'>Đã từ chối</Tag>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
			key: 'note',
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (text: any, record: RejectedRequest) => (
				<span>{/* Add actions for rejected requests here, e.g., View Detail */}</span>
			),
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={data}
			loading={loading}
			rowKey='_id'
			pagination={pagination}
			onChange={handleTableChange}
		/>
	);
};

export default RejectedRequests;
