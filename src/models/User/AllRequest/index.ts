import { message } from 'antd';
import type { ApiResponse, RequestListParams, RequestListResponse } from '../../../services/User/AllRequest/FEtyping';
import { getBorrowRequests as fetchBorrowRequests } from '@/services/User/AllRequest';

export const getBorrowRequests = async (params: RequestListParams) => {
    try {
        const response = await fetchBorrowRequests(params);
        return response as ApiResponse<RequestListResponse>;
    } catch (error) {
        message.error('Không thể tải danh sách yêu cầu mượn');
        throw error;
    }
}; 