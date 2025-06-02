import rootAPI from '../../rootAPI';

export async function createBorrowRequest(deviceId: string, data: {
  quantity: number;
  borrow_date: string;
  return_date: string;
  reason: string;
}) {
  return rootAPI.post(`/user/borrow-requests/${deviceId}/borrow`, data);
} 