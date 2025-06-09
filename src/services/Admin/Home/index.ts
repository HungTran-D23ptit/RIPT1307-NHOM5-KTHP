import rootAPI from '../../rootAPI';
import type { BorrowRequestStats, AdminActivityLogResponse, DeviceTypeStat, DeviceTotalStats  } from './typing';

export async function getBorrowRequestStats(): Promise<BorrowRequestStats> {
  const res = await rootAPI.get<{ data: BorrowRequestStats }>('/admin/borrow-requests/stats');
  return res.data.data;
}

export async function getAdminActivityLogs(): Promise<AdminActivityLogResponse> {
  const res = await rootAPI.get<{ data: AdminActivityLogResponse }>('/admin/logs');
  return res.data.data;
}

export async function getDeviceTypeStats(): Promise<DeviceTypeStat[]> {
  const res = await rootAPI.get<{ data: { types: DeviceTypeStat[] } }>('/admin/device/types');
  return res.data.types;
}


export async function getDeviceTotalStats(): Promise<DeviceTotalStats> {
  const res = await rootAPI.get<{ data: { total: DeviceTotalStats } }>('/admin/device/statistic/total');
  return res.data.total;
}