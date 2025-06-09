import { useEffect, useState } from 'react';
import {
	getAdminActivityLogs,
	getBorrowRequestStats,
	getDeviceTotalStats,
	getDeviceTypeStats,
} from '@/services/Admin/Home';

import type {
	AdminActivityLogResponse,
	BorrowRequestStats,
	DeviceTotalStats,
	DeviceTypeStat,
} from '@/services/Admin/Home/typing';

// Các function fetch dữ liệu (logic API và xử lý) có thể tái sử dụng bên ngoài hook
export async function fetchBorrowRequestStats(): Promise<BorrowRequestStats> {
	try {
		const stats = await getBorrowRequestStats();
		return stats;
	} catch (error) {
		console.error('Failed to fetch borrow request stats:', error);
		throw error;
	}
}

export async function fetchAdminActivityLogs(): Promise<AdminActivityLogResponse> {
	try {
		const logs = await getAdminActivityLogs();
		// Xử lý loại bỏ chuỗi " bởi Admin" trong description nếu có
		logs.data = logs.data.map((log) => ({
			...log,
			description: log.description.replace(/ bởi Admin/g, ''),
		}));
		return logs;
	} catch (error) {
		console.error('Failed to fetch admin activity logs:', error);
		throw error;
	}
}

export async function fetchDeviceTypeStats(): Promise<DeviceTypeStat[]> {
	try {
		const deviceTypes = await getDeviceTypeStats();
		return deviceTypes;
	} catch (error) {
		console.error('Failed to fetch device type stats:', error);
		throw error;
	}
}

export async function fetchDeviceTotalStats(): Promise<DeviceTotalStats> {
	try {
		const totalStats = await getDeviceTotalStats();
		return totalStats;
	} catch (error) {
		console.error('Failed to fetch device total stats:', error);
		throw error;
	}
}

// Hook dùng trong page để lấy dữ liệu, quản lý trạng thái loading, error
export function useAdminHomeData() {
	const [borrowStats, setBorrowStats] = useState<BorrowRequestStats | null>(null);
	const [adminLogs, setAdminLogs] = useState<AdminActivityLogResponse | null>(null);
	const [deviceTypeStats, setDeviceTypeStats] = useState<DeviceTypeStat[]>([]);
	const [deviceTotalStats, setDeviceTotalStats] = useState<DeviceTotalStats | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	 useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // Gọi tuần tự để bắt lỗi rõ ràng
        const borrow = await fetchBorrowRequestStats();
        console.log('borrowStats:', borrow);

        const logs = await fetchAdminActivityLogs();
        console.log('adminLogs:', logs);

        const types = await fetchDeviceTypeStats();
        console.log('deviceTypeStats:', types);

        const total = await fetchDeviceTotalStats();
        console.log('deviceTotalStats:', total);

        setBorrowStats(borrow);
        setAdminLogs(logs);
        setDeviceTypeStats(types);
        setDeviceTotalStats(total);
      } catch (err) {
        console.error('Load data failed:', err);
        if (err instanceof Error) setError(err.message);
        else setError('Đã có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { borrowStats, adminLogs, deviceTypeStats, deviceTotalStats, loading, error };
}
