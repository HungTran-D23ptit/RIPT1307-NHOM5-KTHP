import { useState } from "react"
import { Card, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { registerUser } from "@/services/auth/api"
import './Register.less';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError('Mật khẩu không khớp!');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError('Mật khẩu không khớp!');
    } else {
      setPasswordError('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu không khớp!');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    setLoading(true);
    try {
      const response = await registerUser({ name, email, password });
      if (response?.data) {
        message.success('Đăng ký thành công!');
        history.push('/auth/login');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <Card>
          <Title level={2} className="register-title">Đăng ký</Title>
          <Text type="secondary" className="register-subtitle">
            Đăng ký tài khoản để sử dụng hệ thống quản lý mượn đồ dùng
          </Text>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <Text className="input-label">Họ tên</Text>
              <Input
                prefix={<UserOutlined />}
                name="name"
                required
              />
            </div>
            <div className="input-group">
              <Text className="input-label">Email</Text>
              <Input
                prefix={<MailOutlined />}
                name="email"
                type="email"
                required
              />
            </div>
            <div className="input-group">
              <Text className="input-label">Mật khẩu</Text>
              <Input.Password
                prefix={<LockOutlined />}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="input-group">
              <Text className="input-label">Nhập lại mật khẩu</Text>
              <Input.Password
                prefix={<LockOutlined />}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {passwordError && (
                <Text className="password-error">{passwordError}</Text>
              )}
            </div>
            <Button 
              type="primary"
              htmlType="submit"
              loading={loading}
              className="register-button"
              disabled={!!passwordError}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          <div className="login-link">
            <Text type="secondary">
              Đã có tài khoản?{" "}
              <a onClick={() => history.push('/auth/login')}>
                Đăng nhập ngay
              </a>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}