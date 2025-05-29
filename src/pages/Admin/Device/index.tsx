import { DeviceType } from '@/services/Admin/Device/typing';
import rootAPI from '@/services/rootAPI';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, message, Row, Select, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import AddDeviceModal from './components/AddDeviceModal';
import AvailableDevices from './components/AvailableDevices';
import BorrowedDevices from './components/BorrowedDevices';
import MaintenanceDevices from './components/MaintenanceDecices';

const { Search } = Input;

const DeviceManagement: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [deviceType, setDeviceType] = useState('all');
	const [deviceStatus, setDeviceStatus] = useState('all');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [activeTabKey, setActiveTabKey] = useState('1');
	const [refreshKey, setRefreshKey] = useState(Date.now());
	const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([{ label: 'Tất cả', value: 'all' }]);

	// const deviceStatuses = [
	//   { label: 'Tất cả', value: 'all' },
	//   { label: 'Có sẵn', value: 'NORMAL' },
	//   { label: 'Đang cho mượn', value: 'BORROWED' },
	//   { label: 'Đang bảo trì', value: 'MAINTENANCE' },
	// ];

	useEffect(() => {
		async function fetchDeviceTypes() {
			try {
				const response = await rootAPI.get('/admin/device/types');
				if (response.data && response.data.types) {
					const types = response.data.types.map((type: string) => ({
						label: type === 'Other' ? 'Khác' : type,
						value: type,
					}));
					setDeviceTypes([{ label: 'Tất cả', value: 'all' }, ...types]);
				}
			} catch (error) {
				message.error('Không thể tải danh sách loại thiết bị');
			}
		}
		fetchDeviceTypes();
	}, []);

	const handleRefresh = () => {
		setRefreshKey(Date.now());
	};

	const handleTabChange = (key: string) => {
		setActiveTabKey(key);
		setDeviceType('all');
		setDeviceStatus('all');
	};

	const handleSearch = (value: string) => {
		setSearchText(value);
	};

	const handleDeviceTypeChange = (value: string) => {
		setDeviceType(value);
	};

	const items = [
		{
			key: '1',
			label: 'Có sẵn',
			children: (
				<AvailableDevices
					key={refreshKey}
					searchText={searchText}
					deviceType={deviceType}
					deviceStatus={deviceStatus}
					onSuccess={handleRefresh}
				/>
			),
		},
		{
			key: '2',
			label: 'Đang cho mượn',
			children: (
				<BorrowedDevices
					key={refreshKey}
					searchText={searchText}
					deviceType={deviceType}
					deviceStatus={deviceStatus}
					onSuccess={handleRefresh}
				/>
			),
		},
		{
			key: '3',
			label: 'Đang bảo trì',
			children: (
				<MaintenanceDevices
					key={refreshKey}
					searchText={searchText}
					deviceType={deviceType}
					deviceStatus={deviceStatus}
					onSuccess={handleRefresh}
				/>
			),
		},
	];

	return (
		<Card>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col span={24} style={{ textAlign: 'right' }}>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
						Thêm thiết bị mới
					</Button>
				</Col>
				<Col span={20}>
					<Search
						placeholder='Tìm kiếm thiết bị...'
						onChange={(e) => handleSearch(e.target.value)}
						style={{ width: '100%' }}
						allowClear
					/>
				</Col>
				<Col span={4}>
					<Select
						style={{ width: '100%' }}
						placeholder='Chọn loại thiết bị'
						options={deviceTypes}
						value={deviceType}
						onChange={handleDeviceTypeChange}
						allowClear
					/>
				</Col>
			</Row>

			<Tabs activeKey={activeTabKey} onChange={handleTabChange} items={items} />

			<AddDeviceModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onSuccess={handleRefresh} />
		</Card>
	);
};

export default DeviceManagement;
