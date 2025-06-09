import rootAPI from '../../rootAPI';
import {
	AddDeviceModalProps,
	AvailableDevicesProps,
	BorrowedDevicesProps,
	DeviceFormData,
	DeviceResponse,
	DeviceTableItem,
	EditDeviceModalProps,
	MaintenanceDevicesProps,
} from './typing';

export async function getDevices(params: {
	status?: string;
	type?: string;
	search?: string;
	page?: number;
	per_page?: number;
}) {
	return rootAPI.get('/admin/device', { params });
}

export async function getDeviceById(id: string) {
	return rootAPI.get(`/admin/device/${id}`);
}

export async function createDevice(data: FormData) {
	return rootAPI.post('/admin/device', data);
}

export async function getBorrowedDevices(params: {
	status?: string;
	type?: string;
	search?: string;
	page?: number;
	per_page?: number;
}) {
	return rootAPI.get('/admin/device/approved', { params });
}

export async function getMaintenanceDevices(params: { search?: string; page?: number; per_page?: number }) {
	return rootAPI.get('/admin/device', {
		params: {
			...params,
			status: 'MAINTENANCE',
		},
	});
}

export async function updateDevice(id: string, data: any) {
	if (data instanceof FormData) {
		return rootAPI.put(`/admin/device/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	// If data contains a file, convert to FormData
	if (data.image_url instanceof File) {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (key === 'image_url' && value instanceof File) {
				formData.append('image', value);
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

export async function getDeviceTypes() {
	return rootAPI.get('/admin/device/types');
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
};
