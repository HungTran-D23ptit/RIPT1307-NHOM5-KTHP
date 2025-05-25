import { Card, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { history } from 'umi';
import useRegisterModel from '@/models/User/register';
import './Register.less';

const { Title, Text } = Typography;

export default function RegisterPage() {
	const { loading, passwordError, handlePasswordChange, handleConfirmPasswordChange, handleRegister } =
		useRegisterModel();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		await handleRegister(name, email);
	};

	return (
		<div className='register-container'>
			<div className='register-card'>
				<Card>
					<Title level={2} className='register-title'>
						Đăng ký
					</Title>
					<Text type='secondary' className='register-subtitle'>
						Đăng ký tài khoản để sử dụng hệ thống quản lý mượn đồ dùng
					</Text>

					<form onSubmit={onSubmit}>
						<div className='input-group'>
							<Text className='input-label'>Họ tên</Text>
							<Input prefix={<UserOutlined />} name='name' required />
						</div>
						<div className='input-group'>
							<Text className='input-label'>Email</Text>
							<Input prefix={<MailOutlined />} name='email' type='email' required />
						</div>
						<div className='input-group'>
							<Text className='input-label'>Mật khẩu</Text>
							<Input.Password
								prefix={<LockOutlined />}
								name='password'
								onChange={(e) => handlePasswordChange(e.target.value)}
								required
							/>
						</div>
						<div className='input-group'>
							<Text className='input-label'>Nhập lại mật khẩu</Text>
							<Input.Password
								prefix={<LockOutlined />}
								onChange={(e) => handleConfirmPasswordChange(e.target.value)}
								required
							/>
							{passwordError && <Text className='password-error'>{passwordError}</Text>}
						</div>
						<Button
							type='primary'
							htmlType='submit'
							loading={loading}
							className='register-button'
							disabled={!!passwordError}
						>
							{loading ? 'Đang đăng ký...' : 'Đăng ký'}
						</Button>
					</form>

					<div className='login-link'>
						<Text type='secondary'>
							Đã có tài khoản? <a onClick={() => history.push('/auth/login')}>Đăng nhập ngay</a>
						</Text>
					</div>
				</Card>
			</div>
		</div>
	);
}
