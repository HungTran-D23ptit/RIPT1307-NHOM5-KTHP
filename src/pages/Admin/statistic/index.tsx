import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, message, Tabs } from 'antd';
import { Pie } from '@ant-design/plots';
import { ArrowDownOutlined, ArrowUpOutlined, UserOutlined, BookOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import request from '@/utils/request';

interface BorrowStats {
	PENDING: number;
	APPROVED: number;
	REJECTED: number;
	RETURNING: number;
	RETURNED: number;
	OVERDUE: number;
	CANCELLED: number;
}

interface MostBorrowedDevice {
	borrowCount: number;
	device_id: string;
	name: string;
	code: string;
	image_url: string;
}

interface UserStats {
	total: number;
	active: number;
	deActive: number;
}

interface DeviceTotalStats {
	total: {
		total: number;
		NORMAL: number;
		MAINTENANCE: number;
	}
}

interface DeviceTypeStats {
	type: string;
	count: number;
}

interface DeviceStatusData {
	type: string;
	value: number;
}

const StatisticPage: React.FC = () => {
	const [borrowStats, setBorrowStats] = useState<BorrowStats | null>(null);
	const [mostBorrowedDevices, setMostBorrowedDevices] = useState<MostBorrowedDevice[]>([]);
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [deviceTotalStats, setDeviceTotalStats] = useState<DeviceTotalStats | null>(null);
	const [deviceTypes, setDeviceTypes] = useState<string[]>([]);
	const [deviceTypeStats, setDeviceTypeStats] = useState<DeviceTypeStats[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [borrowRes, deviceRes, userRes, deviceTotalRes, deviceTypesRes] = await Promise.all([
					request.get('/admin/borrow-requests/stats'),
					request.get('/admin/device/stats/most-borrowed'),
					request.get('/admin/users/statistic/total'),
					request.get('/admin/device/statistic/total'),
					request.get('/admin/device/types'),
				]);

				setBorrowStats(borrowRes.data);
				setMostBorrowedDevices(Array.isArray(deviceRes) ? deviceRes : []);
				setUserStats(userRes);
				setDeviceTotalStats(deviceTotalRes);
				setDeviceTypes(deviceTypesRes.types || []);

				// Fetch stats for each device type
				const typeStatsPromises = deviceTypesRes.types.map(async (type: string) => {
					const response = await request.get(`/admin/borrow-requests?type=${type}`);
					return {
						type,
						count: response.data.total || 0
					};
				});

				const typeStats = await Promise.all(typeStatsPromises);
				setDeviceTypeStats(typeStats);

			} catch (error) {
				console.error('Error fetching statistics:', error);
				message.error('Không thể tải dữ liệu thống kê.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const borrowColumns = [
		{
			title: 'Thiết bị',
			dataIndex: 'name',
			key: 'name',
			render: (text: string, record: MostBorrowedDevice) => (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img src={record.image_url} alt={record.name} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }} />
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
			render: (text: string) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: 'Số lượt mượn',
			dataIndex: 'borrowCount',
			key: 'borrowCount',
			width: 120,
			sorter: (a: MostBorrowedDevice, b: MostBorrowedDevice) => a.borrowCount - b.borrowCount,
		},
		{
			title: 'Tỷ lệ sử dụng',
			dataIndex: 'usageRate',
			key: 'usageRate',
			width: 120,
			render: (text: number) => (
				<div style={{ display: 'flex', alignItems: 'center'}}>
					{text ? `${text.toFixed(2)}%` : 'N/A'}
					<span style={{ marginLeft: 5, color: text > 0 ? '#52c41a' : '#ff4d4f'}}>
						{text > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
					</span>
				</div>
			),
		},
		{
			title: 'Xu hướng',
			dataIndex: 'trend',
			key: 'trend',
			width: 100,
			render: (text: number) => (
				<span style={{ color: text > 0 ? '#52c41a' : '#ff4d4f'}}>
					{text > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
					{text ? `${Math.abs(text).toFixed(2)}%` : 'N/A'}
				</span>
			)
		},
	];

	const calculateTrendAndUsageRate = (data: MostBorrowedDevice[] | null | undefined) => {
		if (!Array.isArray(data)) {
			return [];
		}
		// In a real application, you would fetch historical data to calculate these.
		// For this example, I'm adding some mock logic.
		return data.map(item => ({
			...item,
			usageRate: Math.random() * 100, // Mock usage rate
			trend: Math.random() * 20 - 10, // Mock trend between -10 and 10
		}));
	};

	const processedMostBorrowedDevices = calculateTrendAndUsageRate(mostBorrowedDevices);

	const totalBorrowed = (borrowStats?.APPROVED || 0) + (borrowStats?.RETURNED || 0) + (borrowStats?.RETURNING || 0) + (borrowStats?.OVERDUE || 0);
	const totalReturnedAndOverdue = (borrowStats?.RETURNED || 0) + (borrowStats?.OVERDUE || 0);
	const onTimeReturnRate = totalReturnedAndOverdue > 0 ? ((borrowStats?.RETURNED || 0) / totalReturnedAndOverdue) * 100 : 0;

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
						<Card title="Thiết bị được mượn nhiều nhất trong tháng">
							<Table
								columns={borrowColumns}
								dataSource={processedMostBorrowedDevices}
								pagination={false}
								rowKey="device_id"
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
						<Card title="Phân bố trạng thái thiết bị">
							<Pie
								data={deviceStatusData}
								angleField="value"
								colorField="type"
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
						<Card title="Tỉ lệ sử dụng thiết bị">
							<Pie
								data={deviceTypeStats}
								angleField="count"
								colorField="type"
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
		<div className="statistic-page">
			<h1>Thống kê</h1>
			<p>Xem báo cáo và thống kê về hoạt động mượn trả thiết bị</p>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card 
						style={{ 
							background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
							borderRadius: '12px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
							boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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

			<Tabs defaultActiveKey="1" items={items} />
		</div>
	);
};

export default StatisticPage;
