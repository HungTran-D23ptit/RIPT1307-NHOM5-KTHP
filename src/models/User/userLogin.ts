import { useState } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { loginUser } from '@/services/User/Auth/index';

export default () => {
	const [loading, setLoading] = useState<boolean>(false);

	const handleLoginError = (error: any) => {
		const errorMessage = error.response?.data?.message;
		const errorData = error.response?.data;

		if (errorData?.email || errorData?.password) {
			const detailErrors = [];
			if (errorData.email) detailErrors.push(`Email: ${errorData.email}`);
			if (errorData.password) detailErrors.push(`Mật khẩu: ${errorData.password}`);
			message.error(detailErrors.join('\n'));
			return;
		}

		switch (errorMessage) {
			case 'Invalid credentials':
				message.error('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại email và mật khẩu');
				break;
			case 'User not found':
				message.error('Tài khoản không tồn tại');
				break;
			case 'Account is locked':
				message.error('Tài khoản đã bị khóa');
				break;
			case 'Too many login attempts':
				message.error('Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau');
				break;
			case 'Email not verified':
				message.error('Email chưa được xác thực. Vui lòng kiểm tra hộp thư của bạn');
				break;
			case 'Invalid email format':
				message.error('Định dạng email không hợp lệ');
				break;
			case 'Password is required':
				message.error('Vui lòng nhập mật khẩu');
				break;
			default:
				message.error(errorMessage || 'Đã xảy ra lỗi. Vui lòng thử lại sau');
		}
	};	const handleLogin = async (email: string, password: string) => {
		setLoading(true);
		try {
			const userResponse = await loginUser({ email, password });
			if (userResponse?.data?.data) {
				localStorage.setItem('token', userResponse.data.data.access_token);
				localStorage.setItem('role', 'user');
				message.success(`Chào mừng quay trở lại`);
				history.push('/user/dashboard');
				return true;
			}
			return false;
		} catch (error: any) {
			handleLoginError(error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		handleLogin,
	};
};
