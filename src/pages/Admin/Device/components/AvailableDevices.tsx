import { useAvailableDevices } from '@/models/Admin/Device/useAvailableDevices';
import { AvailableDevicesProps } from '@/services/Admin/Device/device';
import { Button, Card, Col, Image, Popconfirm, Row, Tag } from 'antd';
import React, { useState } from 'react';
import EditDeviceModal from './EditDeviceModal';
import { API_URL } from '@/config/config';
import { history } from 'umi';
import { getImageUrl } from '@/utils/utils';

const AvailableDevices: React.FC<AvailableDevicesProps> = ({ searchText, deviceType, deviceStatus, onSuccess }) => {
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<any>(null);
	const { devices, loading, handleDelete, getStatusTag, getDeviceTypeLabel } = useAvailableDevices(
		searchText,
		deviceType,
		deviceStatus,
		onSuccess,
	);

	const handleViewDetail = (deviceId: string) => {
		history.push(`/admin/devices/${deviceId}`);
	};

	return (
		<>
			<Row gutter={[16, 16]}>
				{devices.map((device) => (
					<Col key={device._id} xs={24} sm={12} md={8}>
						<Card
							hoverable
							cover={
								<Image
									alt={device.name}
									src={
										getImageUrl(device.image_url) || 'https://via.placeholder.com/300x200?text=No+Image'
									}
									style={{ height: 200, objectFit: 'cover' }}
									preview={false}
								/>
							}
							actions={[
								<Button type="link" onClick={() => handleViewDetail(device._id)}>
									Chi tiết
								</Button>,
								<Button type="link" onClick={() => {
									setSelectedDevice(device);
									setEditModalVisible(true);
								}}>
									Cập nhật
								</Button>,
								<Popconfirm
									title="Bạn có chắc chắn muốn xóa thiết bị này?"
									onConfirm={() => handleDelete(device._id)}
									okText="Xác nhận"
									cancelText="Hủy"
								>
									<Button type="link" danger>
										Xóa
									</Button>
								</Popconfirm>,
							]}
						>
							<Card.Meta
								title={device.name}
								description={
									<>
										<div>Mã: {device.code}</div>
										<div>Loại: {getDeviceTypeLabel(device.type)}</div>
										<div>Trạng thái: {getStatusTag(device.status)}</div>
										<div>Số lượng: {device.quantity}</div>
									</>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<EditDeviceModal
				visible={editModalVisible}
				onCancel={() => {
					setEditModalVisible(false);
					setSelectedDevice(null);
				}}
				onSuccess={() => {
					setEditModalVisible(false);
					setSelectedDevice(null);
					if (onSuccess) onSuccess();
				}}
				initialData={selectedDevice}
			/>
		</>
	);
};

export default AvailableDevices;
