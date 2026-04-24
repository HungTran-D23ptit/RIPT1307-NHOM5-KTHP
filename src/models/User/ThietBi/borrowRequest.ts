import { createBorrowRequest } from '@/services/User/BorrowRequest';
import { getDeviceById } from '@/services/User/Device';
import { message } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { BorrowRequestForm, BorrowRequestState } from './types';

export const fetchDeviceInfo = async (id: string, setDevice: (device: any) => void) => {
	try {
		const res = await getDeviceById(id);
		setDevice(res.data?.data);
	} catch (error) {
		message.error('Không thể tải thông tin thiết bị');
	}
};

export const validateBorrowRequest = (state: BorrowRequestState): boolean => {
	if (!state.borrowDate || !state.returnDate || !state.reason) {
		message.error('Vui lòng nhập đầy đủ thông tin');
		return false;
	}
	return true;
};

export const submitBorrowRequest = async (
	deviceId: string,
	formData: BorrowRequestForm,
	setLoading: (loading: boolean) => void,
) => {
	setLoading(true);
	try {
		await createBorrowRequest(deviceId, formData);
		message.success('Tạo đơn mượn thành công');
		history.push('/user/borrow-requests');
	} catch (err: any) {
		message.error(err?.response?.data?.message || 'Tạo đơn mượn thất bại');
	} finally {
		setLoading(false);
	}
};

export const getDisabledBorrowDate = (date: any) => {
	return date && date < moment().startOf('day');
};

export const getDisabledReturnDate = (borrowDate: any) => (date: any) => {
	return borrowDate ? date && date < moment(borrowDate).startOf('day') : date && date < moment().startOf('day');
};
