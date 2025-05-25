import { useState } from 'react';
import { Card, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { Tabs } from 'antd';
import useUserLoginModel from '@/models/User/userLogin';
import useAdminLoginModel from '@/models/Admin/adminLogin';

import './Login.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function LoginPage() {
	const [activeTab, setActiveTab] = useState('user');
	const { loading: userLoading, handleLogin: handleUserLogin } = useUserLoginModel();
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
