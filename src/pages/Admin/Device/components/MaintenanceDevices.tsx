import { getMaintenanceDevices, updateDevice } from '@/services/Admin/Device/device';
import { Button, Card, Col, message, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

interface MaintenanceDevicesProps {
	searchText: string;
	onSuccess?: () => void;
}

const MaintenanceDevices: React.FC<MaintenanceDevicesProps> = ({ searchText, onSuccess }) => {
	const [devices, setDevices] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);

	const fetchDevices = async () => {
		try {
			setLoading(true);
			const response = await getMaintenanceDevices({
				search: searchText,
				page,
				per_page: 10,
			});
			setDevices(response.data.data);
			setTotal(response.data.total);
		} catch (error) {
			message.error('Không thể tải danh sách thiết bị đang bảo trì');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDevices();
	}, [searchText, page]);

	const handleComplete = async (id: string) => {
		try {
			await updateDevice(id, {
				status: 'NORMAL',
				maintenance_end_date: new Date().toISOString(),
			});
			// Remove success message here to avoid duplicate notifications
			fetchDevices();
			if (onSuccess) onSuccess();
		} catch (error) {
			// Remove error message here to avoid duplicate notifications
		}
	};

	const getMaintenanceStatusTag = () => {
		return <Tag color='purple'>Đang bảo trì</Tag>;
	};

	return (
		<Row gutter={[16, 16]}>
			{devices.map((device) => (
				<Col span={8} key={device._id}>
					<Card loading={loading}>
						<h3>{device.name}</h3>
						<p>Mã thiết bị: {device.code}</p>
						<p>Loại: {device.type}</p>
						<p>Mô tả: {device.description || '-'}</p>
						<p>Số lượng: {device.quantity}</p>
						<p>Trạng thái: {getMaintenanceStatusTag()}</p>
						<Row justify='end' gutter={8}>
							<Col>
								<Button type='primary' onClick={() => handleComplete(device._id)}>
									Hoàn thành bảo trì
								</Button>
							</Col>
						</Row>
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default MaintenanceDevices;
