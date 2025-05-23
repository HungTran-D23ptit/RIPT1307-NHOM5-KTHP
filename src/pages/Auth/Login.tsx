import { useState } from "react"
import { Card, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { loginUser, loginAdmin } from "@/services/auth/api"
import './Login.less';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    setLoading(true)
    try {
      try {
        const adminResponse = await loginAdmin({ email, password })
        if (adminResponse?.data) {
          localStorage.setItem("token", adminResponse.data.token)
          localStorage.setItem("user", JSON.stringify(adminResponse.data.user))
          localStorage.setItem("role", "admin")
          message.success(`Chào mừng ${adminResponse.data.user.name}`)
          history.push("/admin/dashboard")
          return
        }
      } catch {
        const userResponse = await loginUser({ email, password })
        if (userResponse?.data) {
          localStorage.setItem("token", userResponse.data.token)
          localStorage.setItem("user", JSON.stringify(userResponse.data.user))
          localStorage.setItem("role", "user")
          message.success(`Chào mừng ${userResponse.data.user.name}`)
          history.push("/user/dashboard")
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Email hoặc mật khẩu không đúng")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <Card>
          <Title level={2} className="login-title">Đăng nhập</Title>
          <Text type="secondary" className="login-subtitle">
            Đăng nhập để sử dụng hệ thống quản lý mượn đồ dùng
          </Text>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <Text className="input-label">Email</Text>
              <Input
                prefix={<UserOutlined />}
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
                required
              />
            </div>
            <Button 
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-button"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="register-link">
            <Text type="secondary">
              Chưa có tài khoản?{" "}
              <a onClick={() => history.push('/auth/register')}>
                Hãy đăng ký ngay
              </a>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}
