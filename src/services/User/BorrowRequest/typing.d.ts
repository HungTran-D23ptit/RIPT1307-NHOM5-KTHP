export interface DeviceInfo {
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
}

export interface BorrowHistoryItem {
  _id: string;
  user: string;
  device: DeviceInfo;
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

export interface BorrowHistorySection {
  total: number;
  page: number;
  per_page: number;
  data: BorrowHistoryItem[];
}

export interface GetBorrowHistoryResponse {
  borrowing: BorrowHistorySection;
  returned: BorrowHistorySection;
  overdue: BorrowHistorySection;
}
