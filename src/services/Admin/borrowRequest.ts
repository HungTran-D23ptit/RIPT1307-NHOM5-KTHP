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