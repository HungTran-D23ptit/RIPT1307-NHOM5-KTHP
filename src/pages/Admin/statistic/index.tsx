import { calculateBorrowStats, calculateTrendAndUsageRate } from '@/models/Admin/Stats/calculations';
import {
	BorrowStats,
	DeviceStatusData,
	DeviceTotalStats,
	DeviceTypeResponse,
	MostBorrowedDevice,
	UserStats,
} from '@/services/Admin/Stats';
import { fetchAllStats, fetchDeviceTypes } from '@/services/Admin/Stats/api';
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	BookOutlined,
	CheckCircleOutlined,
	ExclamationCircleOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import { Card, Col, message, Row, Statistic, Table, Tabs, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

const StatisticPage: React.FC = () => {
	const [borrowStats, setBorrowStats] = useState<BorrowStats | null>(null);
	const [mostBorrowedDevices, setMostBorrowedDevices] = useState<MostBorrowedDevice[]>([]);
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [deviceTotalStats, setDeviceTotalStats] = useState<DeviceTotalStats | null>(null);
	const [deviceTypes, setDeviceTypes] = useState<string[]>([]);
	const [deviceTypeStats, setDeviceTypeStats] = useState<DeviceTypeResponse['types']>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const statsData = await fetchAllStats();

				setBorrowStats(statsData.borrowStats);
				setMostBorrowedDevices(statsData.mostBorrowedDevices);
				setUserStats(statsData.userStats);
				setDeviceTotalStats(statsData.deviceTotalStats);
				setDeviceTypes(statsData.deviceTypes);
				setDeviceTypeStats(statsData.deviceTypeStats);
			} catch (error: any) {
				if (error.message === 'No authentication token found') {
					message.error('Vui lòng đăng nhập để tiếp tục');
				} else {
					message.error('Không thể tải dữ liệu thống kê.');
				}
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const borrowColumns = [
		{
			title: 'Thiết bị',
			dataIndex: 'name',
			key: 'name',
			render: (text: string, record: MostBorrowedDevice) => (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img
						src={record.image_url}
						alt={record.name}
						style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }}
					/>
					<div>
						<div>{text}</div>
						<div style={{ fontSize: 12, color: '#888' }}>Mã: {record.code}</div>
					</div>
				</div>
			),
		},
		{
			title: 'Mã thiết bị',
			dataIndex: 'code',
			key: 'code',
			width: 120,
			render: (text: string) => <Tag color='blue'>{text}</Tag>,
		},
		{
			title: 'Số lượt mượn',
			dataIndex: 'borrowCount',
			key: 'borrowCount',
			width: 120,
			sorter: (a: MostBorrowedDevice, b: MostBorrowedDevice) => a.borrowCount - b.borrowCount,
		},
		
	];

	const processedMostBorrowedDevices = calculateTrendAndUsageRate(mostBorrowedDevices);
	const { totalBorrowed, onTimeReturnRate } = calculateBorrowStats(borrowStats);

	const deviceStatusData: DeviceStatusData[] = [
		{
			type: 'Có sẵn',
			value: deviceTotalStats?.total?.NORMAL || 0,
		},
		{
			type: 'Đang bảo trì',
			value: deviceTotalStats?.total?.MAINTENANCE || 0,
		},
	];

	const items = [
		{
			key: '1',
			label: 'Thống kê mượn trả',
			children: (
				<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
					<Col span={24}>
						<Card title='Thiết bị được mượn nhiều nhất trong tháng'>
							<Table
								columns={borrowColumns}
								dataSource={processedMostBorrowedDevices}
								pagination={false}
								rowKey='device_id'
								loading={loading}
							/>
						</Card>
					</Col>
				</Row>
			),
		},
		{
			key: '2',
			label: 'Thống kê thiết bị',
			children: (
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Card title='Phân bố trạng thái thiết bị'>
							<Pie
								data={deviceStatusData}
								angleField='value'
								colorField='type'
								radius={0.8}
								label={{
									type: 'outer',
									content: '{name}: {value} ({percentage})',
								}}
								interactions={[
									{
										type: 'element-active',
									},
								]}
								legend={{
									layout: 'horizontal',
									position: 'bottom',
								}}
							/>
						</Card>
					</Col>
					<Col span={12}>
						<Card title='Tỉ lệ số lượng thiết bị'>
							<Pie
								data={deviceTypeStats}
								angleField='count'
								colorField='type'
								radius={0.8}
								label={{
									type: 'outer',
									content: '{name}: {value} ({percentage})',
								}}
								interactions={[
									{
										type: 'element-active',
									},
								]}
								legend={{
									layout: 'horizontal',
									position: 'bottom',
								}}
							/>
						</Card>
					</Col>
				</Row>
			),
		},
	];

	return (
		<div className='statistic-page'>
			<h1>Thống kê</h1>
			<p>Xem báo cáo và thống kê về hoạt động mượn trả thiết bị</p>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card
						style={{
							background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
							borderRadius: '12px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
						}}
					>
						<Statistic
							title={<span style={{ color: '#fff', fontSize: '16px' }}>Tổng lượt mượn</span>}
							value={totalBorrowed}
							precision={0}
							valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
							prefix={<BookOutlined style={{ color: '#fff', fontSize: '24px' }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card
						style={{
							background: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
							borderRadius: '12px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
						}}
					>
						<Statistic
							title={<span style={{ color: '#fff', fontSize: '16px' }}>Tỷ lệ trả đúng hạn</span>}
							value={onTimeReturnRate}
							precision={0}
							valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
							prefix={<CheckCircleOutlined style={{ color: '#fff', fontSize: '24px' }} />}
							suffix={<span style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>%</span>}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card
						style={{
							background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
							borderRadius: '12px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
						}}
					>
						<Statistic
							title={<span style={{ color: '#fff', fontSize: '16px' }}>Người dùng hoạt động</span>}
							value={userStats?.active || 0}
							precision={0}
							valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
							prefix={<UserOutlined style={{ color: '#fff', fontSize: '24px' }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card
						style={{
							background: 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
							borderRadius: '12px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
						}}
					>
						<Statistic
							title={<span style={{ color: '#fff', fontSize: '16px' }}>Thiết bị đang bảo trì</span>}
							value={deviceTotalStats?.total?.MAINTENANCE || 0}
							precision={0}
							valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}
							prefix={<ExclamationCircleOutlined style={{ color: '#fff', fontSize: '24px' }} />}
						/>
					</Card>
				</Col>
			</Row>

			<Tabs defaultActiveKey='1' items={items} />
		</div>
	);
};

export default StatisticPage;
