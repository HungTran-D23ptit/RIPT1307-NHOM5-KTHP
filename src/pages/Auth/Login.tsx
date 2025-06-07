import useAdminLoginModel from '@/models/Admin/adminLogin';
import useUserLoginModel from '@/models/User/userLogin';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Button, Card, Divider, Input, Tabs, Typography } from 'antd';
import { useState } from 'react';
import { history } from 'umi';

import './Login.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function LoginPage() {
	const [activeTab, setActiveTab] = useState('user');
	const { loading: userLoading, handleLogin: handleUserLogin, handleGoogleLogin } = useUserLoginModel();
	const { loading: adminLoading, handleLogin: handleAdminLogin } = useAdminLoginModel();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (activeTab === 'admin') {
			await handleAdminLogin(email, password);
		} else {
			await handleUserLogin(email, password);
		}
	};

	const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
		if (credentialResponse.credential) {
			await handleGoogleLogin(credentialResponse.credential);
		}
	};

	const onGoogleLoginError = () => {
		// Bạn có thể thêm thông báo lỗi nếu muốn
	};

	return (
		<div className='login-container'>
			<div className='login-card'>
				<Card>
					<Title level={2} className='login-title'>
						Đăng nhập
					</Title>
					<Text type='secondary' className='login-subtitle'>
						Đăng nhập để sử dụng hệ thống quản lý mượn đồ dùng
					</Text>

					<Tabs activeKey={activeTab} onChange={setActiveTab} className='mb-6'>
						<TabPane tab='User' key='user' />
						<TabPane tab='Quản trị viên' key='admin' />
					</Tabs>

					<form onSubmit={handleLogin}>
						<div className='input-group'>
							<Text className='input-label'>Email</Text>
							<Input prefix={<UserOutlined />} name='email' type='email' required />
						</div>
						<div className='input-group'>
							<Text className='input-label'>Mật khẩu</Text>
							<Input.Password prefix={<LockOutlined />} name='password' required />
							<div className='forgot-password-link'>
								<a onClick={() => history.push('/auth/forgot-password')}>Quên mật khẩu?</a>
							</div>
						</div>

						<Button
							type='primary'
							htmlType='submit'
							loading={activeTab === 'admin' ? adminLoading : userLoading}
							className='login-button'
						>
							{(activeTab === 'admin' ? adminLoading : userLoading) ? 'Đang đăng nhập...' : 'Đăng nhập'}
						</Button>
					</form>

					{activeTab === 'user' && (
						<>
							<Divider>Hoặc đăng nhập bằng</Divider>
							<GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} useOneTap />
						</>
					)}

					<div className='register-link'>
						<Text type='secondary'>
							Chưa có tài khoản? <a onClick={() => history.push('/auth/register')}>Hãy đăng ký ngay</a>
						</Text>
					</div>
				</Card>
			</div>
		</div>
	);
}
