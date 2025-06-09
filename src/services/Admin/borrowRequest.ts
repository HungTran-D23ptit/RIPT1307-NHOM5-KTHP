import request from '@/utils/request';

export interface BorrowingDevice {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string | null;
    address: string;
    department: string;
    avatar: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  device: {
    _id: string;
    name: string;
    code: string;
    type: string;
    description: string;
    image_url: string;
    quantity: number;
    status: string;
    is_available: boolean;
    last_borrowed_at: string | null;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  reason: string;
  borrow_date: string;
  return_date: string;
  actual_return_date: string | null;
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetBorrowingDevicesResponse {
  total: number;
  page: number;
  per_page: number;
  borrowings: BorrowingDevice[];
}

export async function getBorrowingDevices(params?: { page?: number; per_page?: number }) {
  return request<GetBorrowingDevicesResponse>('/admin/borrow-requests/approved', {
    method: 'GET',
    params,
  });
}

export async function getBorrowRequests(params?: any) {
  return request('/admin/borrow-requests', {
    method: 'GET',
    params: {
      ...params,
      status: params?.status || undefined, // Gửi status nếu có, hoặc undefined nếu không có
    },
  });
}

export async function approveBorrowRequest(id: string) {
  return request(`/admin/borrow-requests/${id}/approve`, {
    method: 'PATCH',
  });
}

export async function rejectBorrowRequest(id: string, note: string) {
  return request(`/admin/borrow-requests/${id}/reject`, {
    method: 'PATCH',
    data: { note },
  });
}

export async function getBorrowRequestDetail(id: string) {
  return request(`/admin/borrow-requests/${id}`, {
    method: 'GET',
  });
}

export async function confirmReturnDevice(id: string) {
  return request(`/admin/borrow-requests/${id}/confirm-return`, {
    method: 'PATCH',
  });
} 