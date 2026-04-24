import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { getBorrowingDevices, BorrowingDevice } from '@/services/Admin/borrowRequest';
import moment from 'moment';
import { history } from 'umi';

interface BorrowedDevicesProps {
	searchText: string;
	deviceType: string;
	deviceStatus: string;
	onSuccess: () => void;
}

const BorrowedDevices: React.FC<BorrowedDevicesProps> = ({
	searchText,
	deviceType,
	deviceStatus,
	onSuccess,
}) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<BorrowingDevice[]>([]);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});

	const fetchData = async (page = 1, pageSize = 10) => {
		setLoading(true);
		try {
			const response = await getBorrowingDevices({ page, per_page: pageSize });
			setData(response.data.borrowings);
			setPagination({
				current: response.data.page,
				pageSize: response.data.per_page,
				total: response.data.total,
			});
		} catch (error) {
			message.error('Không thể tải danh sách thiết bị đang cho mượn');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [searchText, deviceType, deviceStatus]);

	const handleTableChange = (pagination: any) => {
		fetchData(pagination.current, pagination.pageSize);
	};

	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: '_id',
			key: '_id',
			width: 200,
			render: (text: string) => (
			  <Tag color="purple">{text}</Tag>
			),
		  },
		{
			title: 'Thiết bị',
			dataIndex: ['device', 'name'],
			key: 'device',
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
			render: (text: string, record: BorrowingDevice) => (
				<div>
					<div>{text}</div>
					<div style={{ fontSize: 12, color: '#666' }}>{record.user.email}</div>
				</div>
			),
			width:300,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			width: 100,
			render: (text: number) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: 'Ngày mượn',
			dataIndex: 'borrow_date',
			key: 'borrow_date',
			width: 120,
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Ngày trả',
			dataIndex: 'return_date',
			key: 'return_date',
			width: 120,
			render: (text: string) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Lý do',
			dataIndex: 'reason',
			key: 'reason',
			ellipsis: true,
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={data}
			rowKey="_id"
			pagination={pagination}
			loading={loading}
			onChange={handleTableChange}
		/>
	);
};

export default BorrowedDevices;