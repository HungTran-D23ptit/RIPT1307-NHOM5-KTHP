import type { BorrowRequest } from '../AllRequest/FEtyping';

export interface BorrowingStats {
  totalBorrowed: number;
  totalReturned: number;
  pendingApproval: number;
  overdue: number;
}

export interface CurrentBorrowing extends BorrowRequest {
  returnStatus: string;
  daysRemaining: number;
}

export interface ImportantReminder {
  deviceName: string;
  returnDate: string;
}

export interface RecommendedDevice {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imageUrl: string;
  quantity: number;
}