import { useMaintenanceDevices } from '@/models/Admin/Device/useMaintenanceDevices';
import { MaintenanceDevicesProps } from '@/services/Admin/Device/device';
import { Button, Card, Col, Image, Row, Tag } from 'antd';
import React from 'react';

const MaintenanceDevices: React.FC<MaintenanceDevicesProps> = ({ searchText, deviceType, deviceStatus, onSuccess }) => {
	const { devices, loading, handleCompleteMaintenance, getStatusTag, getDeviceTypeLabel } = useMaintenanceDevices(
		searchText,
		deviceType,
		deviceStatus,
		onSuccess,
	);

	return (
		<Row gutter={[16, 16]}>
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
						<Row justify='end'>
							<Button type='primary' onClick={() => handleCompleteMaintenance(device._id)}>
								Hoàn thành bảo trì
							</Button>
						</Row>
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default MaintenanceDevices;
