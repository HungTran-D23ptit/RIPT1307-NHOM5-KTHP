import { deleteDevice, getDevices, updateDevice } from '@/services/Admin/Device/device';
import { Button, Card, Col, Image, message, Popconfirm, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import EditDeviceModal from './EditDeviceModal';

interface AvailableDevicesProps {
	searchText: string;
	deviceType: string;
	deviceStatus: string;
	onSuccess?: () => void;
}

const AvailableDevices: React.FC<AvailableDevicesProps> = ({ searchText, deviceType, deviceStatus, onSuccess }) => {
	const [devices, setDevices] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<any>(null);

	useEffect(() => {
		let mounted = true;

		const fetchDevices = async () => {
			try {
				setLoading(true);
				const response = await getDevices({
					search: searchText,
					type: deviceType === 'all' ? undefined : deviceType,
					status: deviceStatus === 'all' ? undefined : deviceStatus,
					page,
					per_page: 10,
				});
				if (mounted) {
					setDevices(response.data.data);
					setTotal(response.data.total);
				}
			} catch (error) {
				if (mounted) {
					message.error('Không thể tải danh sách thiết bị');
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		};

		fetchDevices();

		return () => {
			mounted = false;
		};
	}, [searchText, deviceType, deviceStatus, page]);

	const handleUpdate = async (id: string) => {
		try {
			await updateDevice(id, {
				status: 'MAINTENANCE',
			});
			message.success('Cập nhật trạng thái thành công');
			// Gọi lại fetchDevices sau khi cập nhật
			if (onSuccess) onSuccess();
		} catch (error) {
			message.error('Không thể cập nhật thiết bị');
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteDevice(id);
			message.success('Xóa thiết bị thành công');
			// Gọi lại fetchDevices sau khi xóa
			if (onSuccess) onSuccess();
		} catch (error) {
			message.error('Không thể xóa thiết bị');
		}
	};

	const getStatusTag = (status: string) => {
		return <Tag color='green'>Có sẵn</Tag>;
	};

	const getDeviceTypeLabel = (type: string | null) => {
		if (!type) return 'Không xác định';
		const types = {
			computer: 'Máy tính',
			monitor: 'Màn hình',
			network: 'Thiết bị mạng',
			audio: 'Thiết bị âm thanh',
			other: 'Khác',
		};
		return types[type as keyof typeof types] || type;
	};

	return (
		<>
			<Row gutter={[16, 16]}>
				{' '}
				{devices.map((device) => (
					<Col span={8} key={device._id}>
						<Card loading={loading}>
							<Image
								src={device.image_url}
								alt={device.name}
								style={{ width: '100%', height: 200, objectFit: 'cover' }}
							/>
							<h3>{device.name}</h3>
							<p>Mã thiết bị: {device.code}</p>
							<p>
								Loại: {getDeviceTypeLabel(device.type)} ({device.type || 'null'})
							</p>
							<p>Mô tả: {device.description || '-'}</p>
							<p>Số lượng: {device.quantity}</p>
							<p>Tình trạng: {getStatusTag(device.status)}</p>
							<Row justify='end' gutter={8}>
								<Col>
									<Button
										type='primary'
										onClick={() => {
											setSelectedDevice(device);
											setEditModalVisible(true);
										}}
									>
										Cập nhật
									</Button>
								</Col>
								<Col>
									<Popconfirm
										title='Xác nhận xóa thiết bị'
										onConfirm={() => handleDelete(device._id)}
										okText='Có'
										cancelText='Không'
									>
										<Button danger>Xóa</Button>
									</Popconfirm>
								</Col>
							</Row>
						</Card>
					</Col>
				))}
			</Row>{' '}
			<EditDeviceModal
				visible={editModalVisible}
				initialData={selectedDevice}
				onCancel={() => {
					setEditModalVisible(false);
					setSelectedDevice(null);
				}}
				onSuccess={() => {
					setEditModalVisible(false);
					setSelectedDevice(null);
					// fetchDevices();
					if (onSuccess) onSuccess();
				}}
			/>
		</>
	);
};

export default AvailableDevices;
