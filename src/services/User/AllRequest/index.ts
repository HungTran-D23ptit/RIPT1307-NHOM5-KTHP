import request from '@/utils/request';
import type { BorrowRequest, RequestListResponse, BorrowHistoryResponse, BorrowStats } from './typing.d';

// API tạo yêu cầu mượn thiết bị mới
export async function createBorrowRequest(deviceId: string, data: {
  quantity: number;
  borrow_date: string;
  return_date: string;
  reason: string;
}) {
  return request<{ message: string; request: BorrowRequest }>(`/user/borrow-requests/${deviceId}/borrow`, {
    method: 'POST',
    data,
  });
}

// API lấy danh sách yêu cầu mượn theo trạng thái
export async function getBorrowRequests(params: {
  status?: string;
  page?: number;
  per_page?: number;
}) {
  return request<RequestListResponse>('/user/borrow-requests', {
    method: 'GET',
    params,
  });
}

// API xem chi tiết một yêu cầu mượn
export async function getBorrowRequestDetail(id: string) {
  return request<BorrowRequest>(`/user/borrow-requests/detail/${id}`, {
    method: 'GET',
  });
}

// API hủy yêu cầu mượn
export async function cancelBorrowRequest(id: string) {
  return request<{ message: string }>(`/user/borrow-requests/${id}/cancel`, {
    method: 'DELETE',
  });
}

// API yêu cầu trả thiết bị
export async function requestReturnDevice(id: string) {
  return request<{ message: string }>(`/user/borrow-requests/${id}/request-return`, {
    method: 'PATCH',
  });
}

// API lấy danh sách thiết bị đang mượn
export async function getBorrowingDevices(params: {
  page?: number;
  per_page?: number;
}) {
  return request<RequestListResponse>('/user/borrow-requests/borrowing', {
    method: 'GET',
    params,
  });
}

// API lấy danh sách thiết bị quá hạn
export async function getOverdueDevices(params: {
  page?: number;
  per_page?: number;
}) {
  return request<RequestListResponse>('/user/borrow-requests/overdue', {
    method: 'GET',
    params,
  });
}

// API lấy danh sách thiết bị đã trả
export async function getReturnedDevices(params: {
  page?: number;
  per_page?: number;
}) {
  return request<RequestListResponse>('/user/borrow-requests/returned', {
    method: 'GET',
    params,
  });
}

// API đánh giá thiết bị sau khi mượn
export async function reviewDevice(id: string, data: {
  rating: number;
  comment: string;
}) {
  return request<{ message: string }>(`/user/borrow-requests/${id}/review`, {
    method: 'POST',
    data,
  });
}

// API lấy toàn bộ lịch sử mượn
export async function getAllBorrowHistory(params: {
  page?: number;
  per_page?: number;
}) {
  return request<BorrowHistoryResponse>('/user/borrow-requests/history/all', {
    method: 'GET',
    params,
  });
}

// API lấy thống kê yêu cầu mượn
export async function getBorrowStats() {
  return request<BorrowStats>('/user/borrow-requests/stats', {
    method: 'GET',
  });
}
