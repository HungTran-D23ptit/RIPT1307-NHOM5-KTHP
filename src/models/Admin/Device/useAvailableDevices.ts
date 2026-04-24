import { deleteDevice, DeviceResponse, getDevices, updateDevice } from '@/services/Admin/Device/device';
import { message, Tag } from 'antd';
import { useEffect, useState } from 'react';
import React from 'react';

const renderStatusTag = (color: string, text: string) => {
	return React.createElement(Tag, { color, style: { margin: 0 } }, text);
};

export const useAvailableDevices = (
	searchText: string,
	deviceType: string,
	deviceStatus: string,
	onSuccess?: () => void,
) => {
	const [devices, setDevices] = useState<DeviceResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		let mounted = true;

		const fetchDevices = async () => {
			try {
				setLoading(true);
				const response = await getDevices({
					search: searchText,
					type: deviceType === 'all' ? undefined : deviceType,
					status: deviceStatus,
					page,
					per_page: 10,
				});
				if (mounted) {
					setDevices(response.data.data.data);
					setTotal(response.data.data.total);
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

	const handleUpdate = async (id: string, newStatus: string) => {
		try {
			await updateDevice(id, {
				status: newStatus,
			});
			message.success('Cập nhật trạng thái thành công');
			if (onSuccess) onSuccess();
		} catch (error) {
			message.error('Không thể cập nhật thiết bị');
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteDevice(id);
			message.success('Xóa thiết bị thành công');
			if (onSuccess) onSuccess();
		} catch (error) {
			message.error('Không thể xóa thiết bị');
		}
	};

	const getStatusTag = (status: string) => {
		const statusConfig = {
			NORMAL: { color: '#52c41a', text: 'Sẵn sàng để mượn' },
			MAINTENANCE: { color: '#faad14', text: 'Đang bảo trì' },
		};

		const config = statusConfig[status as keyof typeof statusConfig];
		if (!config) return null;

		return renderStatusTag(config.color, config.text);
	};

	const getDeviceTypeLabel = (type: string | null) => {
		if (!type) return 'Chưa phân loại';
		const types = {
			computer: 'Máy tính',
			monitor: 'Màn hình',
			network: 'Thiết bị mạng',
			audio: 'Thiết bị âm thanh',
			other: 'Khác',
		};
		return types[type as keyof typeof types] || type;
	};

	return {
		devices,
		loading,
		page,
		total,
		setPage,
		handleUpdate,
		handleDelete,
		getStatusTag,
		getDeviceTypeLabel,
	};
};
