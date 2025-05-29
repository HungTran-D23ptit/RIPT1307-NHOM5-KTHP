import { useAvailableDevices } from '@/models/Admin/Device/useAvailableDevices';
import { AvailableDevicesProps } from '@/services/Admin/Device/device';
import { Button, Card, Col, Image, Popconfirm, Row, Tag } from 'antd';
import React, { useState } from 'react';
import EditDeviceModal from './EditDeviceModal';

const AvailableDevices: React.FC<AvailableDevicesProps> = ({ searchText, deviceType, deviceStatus, onSuccess }) => {
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<any>(null);
	const { devices, loading, handleUpdate, handleDelete, getStatusTag, getDeviceTypeLabel } = useAvailableDevices(
		searchText,
		deviceType,
		deviceStatus,
		onSuccess,
	);

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
							<p>
								Tình trạng: <Tag color={getStatusTag(device.status).color}>{getStatusTag(device.status).text}</Tag>
							</p>
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
					if (onSuccess) onSuccess();
				}}
			/>
		</>
	);
};

export default AvailableDevices;
