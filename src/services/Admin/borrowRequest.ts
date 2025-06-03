import request from '@/utils/request';

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