export interface BorrowRequestStats {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  RETURNING: number;
  RETURNED: number;
  OVERDUE: number;
  CANCELLED: number;
}

export interface AdminInfo {
  _id: string;
  email: string;
  name: string;
}

export interface AdminActivityLog {
  _id: string;
  admin_id: AdminInfo;
  action: string;
  target_type: string;
  target_id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AdminActivityLogResponse {
  message: string;
  data: AdminActivityLog[];
  total: number;
}

export interface DeviceTypeStat {
  type: string;
  count: number;
}

export interface DeviceTotalStats {
  total: number;
  NORMAL: number;
  MAINTENANCE: number;
}
