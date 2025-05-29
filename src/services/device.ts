import rootAPI from './rootAPI';

export async function getDevices(params: {
	status?: string;
	type?: string;
	search?: string;
	page?: number;
	per_page?: number;
}) {
	return rootAPI.get('/admin/device', { params });
}

export async function getBorrowedDevices(params: {
	status?: string;
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
	return rootAPI.put(`/admin/device/${id}`, data);
}

export async function deleteDevice(id: string) {
	return rootAPI.delete(`/admin/device/${id}`);
}
