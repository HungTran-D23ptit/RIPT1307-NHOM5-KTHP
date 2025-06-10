import { DEVICE_TYPES } from './constants';
import { DeviceResponse, StatusInfo } from './types';

export const getStatusInfo = (device: DeviceResponse): StatusInfo => {
	if (device.status === 'NORMAL' && device.quantity > 1) {
		return {
			status: 'Có sẵn',
			statusClass: 'thiet-bi__status-badge--available',
			canBorrow: true,
		};
	} else if (device.status === 'NORMAL' && device.quantity === 1) {
		return {
			status: 'Sắp hết',
			statusClass: 'thiet-bi__status-badge--low-stock',
			canBorrow: true,
		};
	} else if (device.status === 'NORMAL' && device.quantity === 0) {
		return {
			status: 'Hết hàng',
			statusClass: 'thiet-bi__status-badge--out-of-stock',
			canBorrow: false,
		};
	} else {
		return {
			status: 'Đang bảo trì',
			statusClass: 'thiet-bi__status-badge--maintenance',
			canBorrow: false,
		};
	}
};

export const getDeviceTypeLabel = (type: string): string => {
	const found = DEVICE_TYPES.find((t) => t.value === type);
	return found ? found.label : type;
};
