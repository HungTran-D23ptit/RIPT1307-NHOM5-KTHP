import { useState } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { registerUser } from '@/services/User/Auth/index';

export default () => {
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		if (confirmPassword && value !== confirmPassword) {
			setPasswordError('Mật khẩu không khớp!');
		} else {
			setPasswordError('');
		}
	};

	const handleConfirmPasswordChange = (value: string) => {
		setConfirmPassword(value);
		if (value !== password) {
			setPasswordError('Mật khẩu không khớp!');
		} else {
			setPasswordError('');
		}
	};

	const handleRegister = async (name: string, email: string) => {
		if (password !== confirmPassword) {
			setPasswordError('Mật khẩu không khớp!');
			return false;
		}

		setLoading(true);
		try {
			const response = await registerUser({ name, email, password });
			if (response?.data?.message) {
				message.success(response.data.message);
				history.push('/auth/login');
				return true;
			}
			return false;
		} catch (error: any) {
			message.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		passwordError,
		handlePasswordChange,
		handleConfirmPasswordChange,
		handleRegister,
	};
};
