import { useState } from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { history } from 'umi';
import useForgotResetPasswordModel from '@/models/User/useForgotResetPasswordModel';

const { Title, Text } = Typography;

export default function ForgotResetPasswordPage() {
  const { loading, handleForgotPassword, handleResetPassword } = useForgotResetPasswordModel();
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot');
  const [email, setEmail] = useState('');
  const [form] = Form.useForm();

  const onForgotSubmit = async (values: { email: string }) => {
    const success = await handleForgotPassword(values.email);
    if (success) {
      setEmail(values.email);
      setStep('reset');
    }
  };

  const onResetSubmit = async (values: { otp: string; newPassword: string; confirmPassword: string }) => {
    const success = await handleResetPassword(email, values.otp, values.newPassword, values.confirmPassword);
    if (success) {
      form.resetFields();
      setStep('forgot');
      history.push('/auth/login'); 
    }
  };

  return (
    <div className="forgot-reset-password-container" style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>
          {step === 'forgot' ? 'Quên mật khẩu' : 'Đổi mật khẩu'}
        </Title>

        {step === 'forgot' && (
          <>
            <Text>Nhập email của bạn để nhận mã OTP đổi mật khẩu</Text>
            <Form layout="vertical" onFinish={onForgotSubmit} style={{ marginTop: 16 }}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Gửi mã OTP
                </Button>
              </Form.Item>

              <Form.Item>
                <Button type="default" onClick={() => history.push('/auth/login')} block>
                  Quay lại đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {step === 'reset' && (
          <>
            <Text>Nhập mã OTP và mật khẩu mới</Text>
            <Form form={form} layout="vertical" onFinish={onResetSubmit} style={{ marginTop: 16 }}>
              <Form.Item
                name="otp"
                label="Mã OTP"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã OTP' },
                  { len: 6, message: 'Mã OTP gồm 6 ký tự' },
                ]}
              >
                <Input placeholder="Mã OTP" maxLength={6} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Xác nhận mật khẩu không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Đổi mật khẩu
                </Button>
              </Form.Item>

              <Form.Item>
                <Button type="default" onClick={() => setStep('forgot')} block>
                  Quay lại bước nhập email
                </Button>
              </Form.Item>

              <Form.Item>
                <Button type="link" onClick={() => history.push('/auth/login')} block>
                  Quay lại đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}
