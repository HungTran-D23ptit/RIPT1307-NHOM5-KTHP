import { getBorrowedDevices } from '@/services/Admin/Device/device';
import { message, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

const BorrowedDevices: React.FC<{
	searchText: string;
}> = ({ searchText }) => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await getBorrowedDevices({
				search: searchText,
				page,
				per_page: 10,
			});
			setData(response.data.data);
			setTotal(response.data.total);
		} catch (error) {
			message.error('Không thể tải danh sách thiết bị đang mượn');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [searchText, page]);

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
				let color = 'blue';
				let text = 'Đang mượn';

				if (status === 'RETURNED') {
					color = 'green';
					text = 'Đã trả';
				} else if (status === 'LATE') {
					color = 'red';
					text = 'Trả trễ';
				}

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
