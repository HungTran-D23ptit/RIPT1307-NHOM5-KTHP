// Định nghĩa các interface cho các response từ API
export interface BorrowRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  device: {
    _id: string;
    name: string;
    code: string;
    type: string;
    image_url?: string;
    quantity: number;
  };
  quantity: number;
  reason: string;
  borrow_date: string;
  return_date: string;
  actual_return_date?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'RETURNING' | 'RETURNED' | 'OVERDUE';
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface RequestListResponse extends ApiResponse<{
  total: number;
  page: string;
  per_page: string;
  requests: BorrowRequest[];
}> {}

export interface BorrowHistoryResponse {
  borrowing: {
    total: number;
    page: number;
    per_page: number;
    data: BorrowRequest[];
  };
  returned: {
    total: number;
    page: number;
    per_page: number;
    data: BorrowRequest[];
  };
  overdue: {
    total: number;
    page: number;
    per_page: number;
    data: BorrowRequest[];
  };
}

export interface BorrowStats {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  CANCELLED: number;
  RETURNING: number;
  RETURNED: number;
  OVERDUE: number;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}
