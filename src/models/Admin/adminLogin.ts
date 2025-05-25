import { useState } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { loginAdmin } from '@/services/Admin/Auth/adminApi';

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
	};

	const handleLogin = async (email: string, password: string) => {
		setLoading(true);
		try {
			const adminResponse = await loginAdmin({ email, password });
			console.log('Admin login response:', adminResponse);

			if (adminResponse?.data?.data) {
				const token = adminResponse.data.data.access_token;
				if (token) {
					localStorage.setItem('token', token);
					localStorage.setItem('user', JSON.stringify(adminResponse.data.data.user || {}));
					localStorage.setItem('role', 'admin');
					message.success(`Chào mừng quản trị viên`);
					history.push('/admin/dashboard');
					return true;
				}
			}
			message.error('Không nhận được token từ server');
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
