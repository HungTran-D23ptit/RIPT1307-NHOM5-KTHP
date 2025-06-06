export interface BorrowRequest {
    _id: string;
    device: {
        _id: string;
        name: string;
        code: string;
        type?: string;
        image_url?: string;
    };
    user: {
        phone?: string;
    };
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'RETURNING' | 'RETURNED' | 'OVERDUE';
    quantity: number;
    reason?: string;
    note?: string;
    borrow_date: string;
    return_date: string;
    created_at: string;
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
}

export interface RequestListResponse {
    total: number;
    page: string;
    per_page: string;
    requests: BorrowRequest[];
}

export interface RequestListParams {
    status: string;
    page: number;
    per_page: number;
}

export interface RequestCardProps {
    item: BorrowRequest;
    onViewDetail: (item: BorrowRequest) => void;
    onRequestUpdate?: () => void;
}

export interface RequestDetailProps {
    requestId: string;
    onBack: () => void;
}

export interface SearchHeaderProps {
    onSearch?: (value: string) => void;
} 