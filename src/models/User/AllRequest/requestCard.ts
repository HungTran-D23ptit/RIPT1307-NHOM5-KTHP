import { Modal, message } from 'antd';
import moment from 'moment';
import type { BorrowRequest } from '../../../services/User/AllRequest/FEtyping';
import { cancelBorrowRequest, createBorrowRequest } from '@/services/User/AllRequest';

export const handleCancelRequest = async (
    request: BorrowRequest,
    onRequestUpdate?: () => void
) => {
    Modal.confirm({
        title: 'Xác nhận hủy yêu cầu',
        content: 'Bạn có chắc chắn muốn hủy yêu cầu mượn này không?',
        okText: 'Xác nhận',
        cancelText: 'Đóng',
        onOk: async () => {
            try {
                await cancelBorrowRequest(request._id);
                message.success('Hủy yêu cầu mượn thành công');
                if (onRequestUpdate) onRequestUpdate();
            } catch (error: any) {
                message.error(error.response?.data?.message || 'Không thể hủy yêu cầu mượn');
            }
        }
    });
};

export const handleRequestExtension = () => {
    Modal.info({
        title: 'Yêu cầu gia hạn',
        content: 'Vui lòng liên hệ trực tiếp với quản lý thiết bị để được hướng dẫn thủ tục gia hạn.',
        okText: 'Đã hiểu',
    });
};

export const handleRecreateRequest = async (
    request: BorrowRequest,
    onRequestUpdate?: () => void
) => {
    Modal.confirm({
        title: 'Tạo lại yêu cầu',
        content: 'Bạn có muốn tạo lại yêu cầu mượn này không?',
        okText: 'Xác nhận',
        cancelText: 'Đóng',
        onOk: async () => {
            try {
                await createBorrowRequest(request.device._id, {
                    quantity: request.quantity,
                    reason: request.reason,
                    borrow_date: moment().add(1, 'days').startOf('day').toISOString(),
                    return_date: moment().add(7, 'days').startOf('day').toISOString(),
                });
                message.success('Tạo lại yêu cầu mượn thành công');
                if (onRequestUpdate) onRequestUpdate();
            } catch (error: any) {
                message.error(error.response?.data?.message || 'Không thể tạo lại yêu cầu mượn');
            }
        }
    });
}; 