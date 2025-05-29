import { useBorrowedDevices } from '@/models/Admin/Device/useBorrowedDevices';
import { BorrowedDevicesProps } from '@/services/Admin/Device/device';
import { Table, Tag } from 'antd';
import React from 'react';

const BorrowedDevices: React.FC<BorrowedDevicesProps> = ({ searchText }) => {
	const { data, loading, page, total, setPage, getStatusTag } = useBorrowedDevices(searchText);

	const columns = [
		{
			title: 'Mã thiết bị',
			dataIndex: 'code',
			key: 'code',
		},
		{
			title: 'Tên thiết bị',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Ngày mượn',
			dataIndex: 'borrow_date',
			key: 'borrow_date',
		},
		{
			title: 'Ngày trả',
			dataIndex: 'return_date',
			key: 'return_date',
		},
		{
			title: 'Người mượn',
			dataIndex: ['user', 'name'],
			key: 'borrower_name',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				const { color, text } = getStatusTag(status);
				return <Tag color={color}>{text}</Tag>;
			},
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={data}
			loading={loading}
			rowKey='id'
			pagination={{
				total,
				pageSize: 10,
				onChange: (newPage) => setPage(newPage),
			}}
		/>
	);
};

export default BorrowedDevices;
