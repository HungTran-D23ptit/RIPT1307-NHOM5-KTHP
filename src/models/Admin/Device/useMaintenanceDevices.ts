import { DeviceResponse, getDevices, updateDevice } from '@/services/Admin/Device/device';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useMaintenanceDevices = (
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
					message.error('Không thể tải danh sách thiết bị đang bảo trì');
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

	const handleCompleteMaintenance = async (id: string) => {
		try {
			await updateDevice(id, {
				status: 'NORMAL',
			});
			message.success('Cập nhật trạng thái thành công');
			if (onSuccess) onSuccess();
		} catch (error) {
			message.error('Không thể cập nhật thiết bị');
		}
	};

	const getStatusTag = (status: string) => {
		return {
			color: 'purple',
			text: 'Đang bảo trì',
		};
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

	return {
		devices,
		loading,
		page,
		total,
		setPage,
		handleCompleteMaintenance,
		getStatusTag,
		getDeviceTypeLabel,
	};
};
