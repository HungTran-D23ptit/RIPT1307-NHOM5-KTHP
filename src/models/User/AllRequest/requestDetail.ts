import { Modal, message } from 'antd';
import type { BorrowRequest } from '../../../services/User/AllRequest/FEtyping';
import { getBorrowRequestDetail, cancelBorrowRequest } from '@/services/User/AllRequest';

export const fetchRequestDetail = async (requestId: string): Promise<BorrowRequest | null> => {
    try {
        const response = await getBorrowRequestDetail(requestId);
        return response;
    } catch (error) {
        message.error('Không thể tải thông tin chi tiết yêu cầu mượn');
        return null;
    }
};

export const handleRequestExtension = () => {
    Modal.info({
        title: 'Yêu cầu gia hạn',
        content: 'Vui lòng liên hệ trực tiếp với quản lý thiết bị để được hướng dẫn thủ tục gia hạn.',
        okText: 'Đã hiểu',
    });
};

export const handleCancelRequest = async (
    requestId: string,
    onSuccess: () => void
): Promise<void> => {
    Modal.confirm({
        title: 'Xác nhận hủy yêu cầu',
        content: 'Bạn có chắc chắn muốn hủy yêu cầu mượn này không?',
        okText: 'Xác nhận',
        cancelText: 'Đóng',
        onOk: async () => {
            try {
                await cancelBorrowRequest(requestId);
                message.success('Hủy yêu cầu mượn thành công');
                onSuccess();
            } catch (error: any) {
                message.error(error.response?.data?.message || 'Không thể hủy yêu cầu mượn');
            }
        }
    });
}; 