import { ApprovedRequest } from '@/models/Admin/BorrowRequest/types';
import { useApprovedRequests } from '@/models/Admin/BorrowRequest/useApprovedRequests';
import { Table, Tag } from 'antd';
import moment from 'moment';
import React from 'react';

const ApprovedRequests: React.FC = () => {
	const { loading, data, pagination, handleTableChange } = useApprovedRequests();

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
			render: (status: string) => <Tag color='green'>Đã duyệt</Tag>,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (text: any, record: ApprovedRequest) => (
				<span>{/* Add actions for approved requests here, e.g., View Detail */}</span>
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

export default ApprovedRequests;
