import rootAPI from '../../rootAPI';
import { GetBorrowHistoryResponse } from './typing';

export async function createBorrowRequest(deviceId: string, data: {
  quantity: number;
  borrow_date: string;
  return_date: string;
  reason: string;
}) {
  return rootAPI.post(`/user/borrow-requests/${deviceId}/borrow`, data);
}

export async function getBorrowHistory(): Promise<GetBorrowHistoryResponse> {
  const res = await rootAPI.get('/user/borrow-requests/history/all');
  return res.data.data;
}

export async function reviewBorrowRequest(id: string, data: {
  rating: number;
  comment?: string;
}) {
  return rootAPI.post(`/user/borrow-requests/${id}/review`, data);
}
