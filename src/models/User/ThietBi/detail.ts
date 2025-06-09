import { getDeviceById } from '@/services/User/Device';
import { DeviceDetail } from '@/services/User/Device/typing';
import { useEffect, useState } from 'react';

export const statusMap = {
	NORMAL: { color: '#52c41a', text: 'Sẵn sàng để mượn' },
	MAINTENANCE: { color: '#faad14', text: 'Đang bảo trì' },
};

export const useDeviceDetail = (id: string) => {
	const [loading, setLoading] = useState(true);
	const [device, setDevice] = useState<DeviceDetail | null>(null);
	const [isImageModalVisible, setIsImageModalVisible] = useState(false);

	useEffect(() => {
		const fetchDetail = async () => {
			setLoading(true);
			try {
				const res = await getDeviceById(id);
				setDevice(res.data);
			} catch (e) {
				setDevice(null);
			} finally {
				setLoading(false);
			}
		};
		fetchDetail();
	}, [id]);

	const toggleImageModal = () => {
		setIsImageModalVisible(!isImageModalVisible);
	};

	const canBorrow = device?.status === 'NORMAL' && device?.quantity > 0;

	return {
		loading,
		device,
		isImageModalVisible,
		toggleImageModal,
		canBorrow,
		statusMap,
	};
};
