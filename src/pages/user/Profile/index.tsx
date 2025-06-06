import { Card, Form, Input, Button, Upload, message, DatePicker, Select, Row, Col } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '@/services/User/Profile';
import moment from 'moment';

const { Option } = Select;

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await getUserProfile();
            if (response.data && response.data.data) {
                setUserData(response.data.data);
                form.setFieldsValue({
                    name: response.data.data.name,
                    email: response.data.data.email,
                    phone: response.data.data.phone,
                    gender: response.data.data.gender,
                    dob: response.data.data.dob ? moment(response.data.data.dob) : null,
                    address: response.data.data.address,
                    department: response.data.data.department,
                });
            }
        } catch (error) {
            message.error('Lỗi khi tải thông tin cá nhân.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Append form values to FormData
            Object.keys(values).forEach((key) => {
                if (key === 'dob') {
                    // Convert moment object to ISO string
                    formData.append(key, values[key] ? values[key].toISOString() : '');
                } else if (key !== 'avatar') { // Exclude avatar from normal fields
                     // Append other fields as strings
                    formData.append(key, values[key] === undefined || values[key] === null ? '' : String(values[key]));
                }
            });

            // Add new avatar file to payload if selected
            if (newAvatarFile) {
                 formData.append('avatar', newAvatarFile);
            } else if (userData?.avatar && form.getFieldValue('avatar') === '') { // Check if avatar was originally present and now cleared in form state
                // If existing avatar was cleared, send 'remove' signal
                 formData.append('avatar', 'remove');
            } else if (userData?.avatar) {
                // If no new file and existing avatar is still there, don't send avatar field
                // Backend should keep the existing one
            }
            // Note: If the backend *requires* the avatar field even if not changed, you might need to send the old URL
            // But based on the 'remove' option, sending nothing for avatar when it's unchanged seems reasonable.

            // Update profile with FormData
            const response = await updateUserProfile(formData);

            if (response.data && response.data.data && response.data.data.user) {
                message.success(response.data.data.message || 'Cập nhật thông tin thành công!');
                setUserData(response.data.data.user);
                 setNewAvatarFile(null); // Clear new file state on successful update
                 setNewAvatarPreview(null); // Clear new preview state on successful update
                 fetchUserProfile(); // Re-fetch data to update UI
            }
        } catch (error: any) {
             message.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Chọn ảnh đại diện</div>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <Card title="Hồ sơ cá nhân" style={{ maxWidth: '1000px', margin: 'auto' }}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8}>
                        <div style={{ textAlign: 'center' }}>
                            {/* Avatar Display */}
                            <div style={{
                                width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#f0f0f0', margin: '0 auto 20px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '80px', color: '#ccc', overflow: 'hidden'
                            }}>
                                 {newAvatarPreview ? (
                                    <img src={newAvatarPreview} alt="New Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                 ) : userData?.avatar ? (
                                    <img src={userData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                 ) : (
                                    <UserOutlined />
                                 )}
                            </div>

                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                onChange={(info) => {
                                    if (info.file.status === 'done') {
                                        message.success(`${info.file.name} file uploaded successfully.`);
                                    } else if (info.file.status === 'error') {
                                        message.error(`${info.file.name} file upload failed.`);
                                    }

                                    const reader = new FileReader();
                                    reader.onload = (e: any) => {
                                        setNewAvatarPreview(e.target.result as string);
                                    };
                                    reader.readAsDataURL(info.file.originFileObj as File);

                                    setNewAvatarFile(info.file.originFileObj as File);

                                }}

                            >
                                {newAvatarFile || userData?.avatar ? null : uploadButton}
                            </Upload>
                            {userData?.avatar && !newAvatarFile && (
                                 <Button type="link" danger onClick={() => {
                                     setUserData({...userData, avatar: ''});
                                     setNewAvatarFile(null);
                                     setNewAvatarPreview(null);
                                      form.setFieldsValue({ avatar: '' }); // Set form value to empty string for 'remove' signal
                                 }}>
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
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={userData}
                        >
                            <Form.Item name="name" label="Họ và tên">
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="E-mail">
                                 <Input disabled />
                            </Form.Item>
                            <Form.Item name="phone" label="Số điện thoại">
                                <Input />
                            </Form.Item>
                            <Form.Item name="department" label="Khoa/Ngành">
                                <Input />
                            </Form.Item>
                             <Form.Item name="gender" label="Giới tính">
                                <Select>
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                    <Option value="other">Khác</Option>
                                    <Option value="">Không rõ</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="dob" label="Ngày sinh">
                                 <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ">
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
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