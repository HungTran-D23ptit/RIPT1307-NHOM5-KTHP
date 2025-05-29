import rootAPI from '../../rootAPI';
import {
	AddDeviceModalProps,
	AvailableDevicesProps,
	BorrowedDevicesProps,
	DeviceFormData,
	DeviceResponse,
	DeviceTableItem,
	EditDeviceModalProps,
	GetBorrowedDevicesParams,
	GetDevicesParams,
	GetMaintenanceDevicesParams,
	MaintenanceDevicesProps,
	UpdateDeviceData,
} from './typing';

export async function getDevices(params: GetDevicesParams) {
	return rootAPI.get('/admin/device', { params });
}

export async function createDevice(data: FormData) {
	return rootAPI.post('/admin/device', data);
}

export async function getBorrowedDevices(params: GetBorrowedDevicesParams) {
	return rootAPI.get('/admin/device/approved', { params });
}

export async function getMaintenanceDevices(params: GetMaintenanceDevicesParams) {
	return rootAPI.get('/admin/device', {
		params: {
			...params,
			status: 'MAINTENANCE',
		},
	});
}

export async function updateDevice(id: string, data: UpdateDeviceData | FormData) {
	if (data instanceof FormData) {
		// Log FormData contents for debugging
		console.log('Sending FormData with file:', data.get('file'));

		return rootAPI.put(`/admin/device/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	// If data contains a file, convert to FormData
	if (data.file instanceof File || data.image_url instanceof File) {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (key === 'file' && value instanceof File) {
				formData.append('file', value);
			} else if (key === 'image_url' && value instanceof File) {
				formData.append('file', value);
			} else if (value !== undefined && value !== null) {
				formData.append(key, value.toString());
			}
		});
		return rootAPI.put(`/admin/device/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	return rootAPI.put(`/admin/device/${id}`, data);
}

export async function deleteDevice(id: string) {
	return rootAPI.delete(`/admin/device/${id}`);
}

export type {
	DeviceFormData,
	DeviceResponse,
	DeviceTableItem,
	AddDeviceModalProps,
	EditDeviceModalProps,
	AvailableDevicesProps,
	BorrowedDevicesProps,
	MaintenanceDevicesProps,
	GetDevicesParams,
	GetBorrowedDevicesParams,
	GetMaintenanceDevicesParams,
	UpdateDeviceData,
};
