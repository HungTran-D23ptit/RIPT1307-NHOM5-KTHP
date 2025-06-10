import {
	fetchUserProfileAndFormat,
	prepareProfileFormData,
	updateUserProfileWithFormData,
} from '@/services/User/Profile';
import {
	handleAvatarUpload,
	handleFormSubmit,
	handleRemoveAvatar,
	shouldShowRemoveButton,
	shouldShowUploadButton,
} from '@/services/User/Profile/profileUtils';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Upload } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { emitUserUpdated } from '@/contexts/UserContext';

const { Option } = Select;

const Profile = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState<any>(null);
	const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
	const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);

	useEffect(() => {
		fetchUserProfileAndFormat(form, setUserData, setLoading);
	}, []);

	const uploadButton = (
		<div>
			<UploadOutlined />
			<div style={{ marginTop: 8 }}>Chọn ảnh đại diện</div>
		</div>
	);

	const onFinish = async (values: any) => {
		await handleFormSubmit(
			values,
			newAvatarFile,
			userData,
			form,
			setLoading,
			(updatedUser) => {
				setUserData(updatedUser);
				emitUserUpdated(updatedUser); 
			},
			setNewAvatarFile,
			setNewAvatarPreview,
			prepareProfileFormData,
			updateUserProfileWithFormData,
			fetchUserProfileAndFormat,
		);
	};

	return (
		<div style={{ padding: '20px' }}>
			<Card title='Hồ sơ cá nhân' style={{ maxWidth: '1000px', margin: 'auto' }}>
				<Row gutter={[32, 32]}>
					<Col xs={24} md={8}>
						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									width: '150px',
									height: '150px',
									borderRadius: '50%',
									backgroundColor: '#f0f0f0',
									margin: '0 auto 20px',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									fontSize: '80px',
									color: '#ccc',
									overflow: 'hidden',
								}}
							>
								{newAvatarPreview ? (
									<img
										src={newAvatarPreview}
										alt='New Avatar'
										style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									/>
								) : userData?.avatar ? (
									<img
										src={userData.avatar}
										alt='Avatar'
										style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									/>
								) : (
									<UserOutlined />
								)}
							</div>

							<Upload
								name='avatar'
								listType='picture-card'
								className='avatar-uploader'
								showUploadList={false}
								onChange={(info) => handleAvatarUpload(info, setNewAvatarPreview, setNewAvatarFile)}
							>
								{shouldShowUploadButton(newAvatarFile, userData) ? uploadButton : null}
							</Upload>
							{shouldShowRemoveButton(userData, newAvatarFile) && (
								<Button
									type='link'
									danger
									onClick={() => handleRemoveAvatar(userData, setUserData, setNewAvatarFile, setNewAvatarPreview, form)}
								>
									Xóa ảnh đại diện
								</Button>
							)}

							<h2>{userData?.name}</h2>
							<p style={{ color: '#888' }}>Sinh viên</p>
							{userData?.email && <p>Email: {userData.email}</p>}
							{userData?.phone && <p>Số điện thoại: {userData.phone}</p>}
							{userData && <p>Mã số: {userData._id}</p>}
							{userData && <p>Ngày tạo tài khoản: {moment(userData.created_at).format('DD/MM/YYYY')}</p>}
						</div>
					</Col>

					<Col xs={24} md={16}>
						<h3>Thông tin cá nhân</h3>
						<Form form={form} layout='vertical' onFinish={onFinish} initialValues={userData}>
							<Form.Item name='name' label='Họ và tên'>
								<Input />
							</Form.Item>
							<Form.Item name='email' label='E-mail'>
								<Input disabled />
							</Form.Item>
							<Form.Item name='phone' label='Số điện thoại'>
								<Input />
							</Form.Item>
							<Form.Item name='department' label='Khoa/Ngành'>
								<Input />
							</Form.Item>
							<Form.Item name='gender' label='Giới tính'>
								<Select>
									<Option value='male'>Nam</Option>
									<Option value='female'>Nữ</Option>
									<Option value='other'>Khác</Option>
									<Option value=''>Không rõ</Option>
								</Select>
							</Form.Item>
							<Form.Item name='dob' label='Ngày sinh'>
								<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
							</Form.Item>
							<Form.Item name='address' label='Địa chỉ'>
								<Input.TextArea />
							</Form.Item>

							<Form.Item>
								<Button type='primary' htmlType='submit' loading={loading}>
									Lưu thay đổi
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default Profile;
