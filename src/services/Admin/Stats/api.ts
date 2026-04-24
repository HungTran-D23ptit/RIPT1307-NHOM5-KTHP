import request from '@/utils/request';
import { BorrowStats, DeviceTotalStats, MostBorrowedDevice, UserStats } from './index';

export const fetchAllStats = async () => {
	try {
		const [borrowRes, deviceRes, userRes, deviceTotalRes, deviceTypesRes] = await Promise.all([
			request.get('/admin/borrow-requests/stats'),
			request.get('/admin/device/stats/most-borrowed'),
			request.get('/admin/users/statistic/total'),
			request.get('/admin/device/statistic/total'),
			request.get('/admin/device/types'),
		]);

		// Extract data from the jsonify wrapper (res.data is the actual content)
		const borrowStats = borrowRes.data?.data || borrowRes.data;
		const mostBorrowedDevices = deviceRes.data?.data || deviceRes.data;
		const userStats = userRes.data?.data || userRes.data;
		const deviceTotalStats = deviceTotalRes.data?.data || deviceTotalRes.data;
		const typesResponse = deviceTypesRes.data?.data || deviceTypesRes.data;

		// Ensure we are getting an array of types
		const typeStats = Array.isArray(typesResponse?.types) ? typesResponse.types : [];
		const typeNames = typeStats.map((item: any) => item.type);

		return {
			borrowStats: borrowStats || null,
			mostBorrowedDevices: Array.isArray(mostBorrowedDevices) ? mostBorrowedDevices : [],
			userStats: userStats || null,
			deviceTotalStats: deviceTotalStats || null,
			deviceTypes: typeNames,
			deviceTypeStats: typeStats,
		};
	} catch (error) {
		console.error('Error fetching statistics:', error);
		throw error;
	}
};

export interface DeviceTypeResponse {
	types: {
		type: string;
		count: number;
	}[];
}

export const fetchDeviceTypes = async (): Promise<DeviceTypeResponse> => {
	const response = await request.get('/admin/device/types');
	if (!response || !response.success) {
		throw new Error('Failed to fetch device types');
	}
	return response.data;
};
