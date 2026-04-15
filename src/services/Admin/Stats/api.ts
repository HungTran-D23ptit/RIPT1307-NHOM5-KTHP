import request from '@/utils/request';
import { BorrowStats, DeviceTotalStats, MostBorrowedDevice, UserStats } from './index';

export const fetchAllStats = async () => {
	try {
		const [borrowRes, deviceRes, userRes, deviceTotalRes, deviceTypesRes] = await Promise.all([
			request.get<BorrowStats>('/admin/borrow-requests/stats'),
			request.get<MostBorrowedDevice[]>('/admin/device/stats/most-borrowed'),
			request.get<UserStats>('/admin/users/statistic/total'),
			request.get<DeviceTotalStats>('/admin/device/statistic/total'),
			request.get<{ types: string[] }>('/admin/device/types'),
		]);

		// Fetch stats for each device type
		const typeStatsPromises = deviceTypesRes.types.map(async (type: string) => {
			const response = await request.get<{ total: number }>(`/admin/borrow-requests?type=${type}`);
			return {
				type,
				count: response.data.total || 0,
			};
		});

		const typeStats = await Promise.all(typeStatsPromises);

		return {
			borrowStats: borrowRes.data,
			mostBorrowedDevices: Array.isArray(deviceRes) ? deviceRes : [],
			userStats: userRes,
			deviceTotalStats: deviceTotalRes,
			deviceTypes: deviceTypesRes.types || [],
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
	const response = await request.get<{ types: string[] }>('/admin/device/types');
	if (!response || !response.data) {
		throw new Error('Failed to fetch device types');
	}
	return response.data;
};
