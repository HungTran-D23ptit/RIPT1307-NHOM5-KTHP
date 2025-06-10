import useChangePasswordModel from '@/models/User/useChangePasswordModel';
import { Button, Card, Form, Input, Typography } from 'antd';

const { Title } = Typography;

export default function ChangePasswordPage() {
	const { loading, handleChangePassword } = useChangePasswordModel();
	const [form] = Form.useForm();

	const onFinish = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
		const success = await handleChangePassword(values);
		if (success) form.resetFields();
	};

	return (
		<div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
			<Card>
				<Title level={3}>Đổi mật khẩu</Title>
				<Form layout='vertical' onFinish={onFinish} form={form}>
					<Form.Item
						name='currentPassword'
						label='Mật khẩu hiện tại'
						rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
					>
						<Input.Password placeholder='Mật khẩu hiện tại' />
					</Form.Item>

					<Form.Item
						name='newPassword'
						label='Mật khẩu mới'
						rules={[
							{ required: true, message: 'Vui lòng nhập mật khẩu mới' },
							{ min: 6, message: 'Mật khẩu mới ít nhất 6 ký tự' },
						]}
						hasFeedback
					>
						<Input.Password placeholder='Mật khẩu mới' />
					</Form.Item>

					<Form.Item
						name='confirmPassword'
						label='Xác nhận mật khẩu'
						dependencies={['newPassword']}
						hasFeedback
						rules={[
							{ required: true, message: 'Vui lòng xác nhận mật khẩu' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('newPassword') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
								},
							}),
						]}
					>
						<Input.Password placeholder='Xác nhận mật khẩu' />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit' block loading={loading}>
							Đổi mật khẩu
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
}
