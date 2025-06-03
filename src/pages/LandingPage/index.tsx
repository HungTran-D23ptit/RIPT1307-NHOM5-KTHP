import { Button, Typography } from 'antd';
import { ReadOutlined, RightOutlined, CalendarOutlined, ProfileOutlined, CheckCircleOutlined, } from '@ant-design/icons';
import { history } from 'umi';
import Footer from '@/components/Footer';
import './index.less';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  return (
    <div className="landing-page">
        {/* Navigation */}
        <header className="header">
            <div className="container">
                <nav>
                    <div className="logo">
                        <ReadOutlined style={{ fontSize: 24, color: '#eb2f96' }} />
                        <span className="brand-name">BorrowEase</span>
                    </div>
                    <div className="nav-links">
                        <a onClick={() => history.push('/auth/login')} className="login-link">
                            Đăng nhập
                        </a>
                        <Button type="primary" size="large" onClick={() => history.push('/auth/register')}>
                            Bắt đầu ngay
                        </Button>
                    </div>
                </nav>
            </div>
        </header>

       {/* Hero Section */}
        <section className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <Title level={1}>
                            Hệ thống Quản lý <span className="highlight">Mượn Đồ Dùng</span>
                        </Title>
                        <Paragraph className="hero-description">
                            Giải pháp hiện đại giúp sinh viên và câu lạc bộ dễ dàng mượn thiết bị, theo dõi lịch sử và quản lý tồn kho hiệu quả.
                        </Paragraph>
                        <div className="hero-buttons">                            <Button type="primary" size="large" icon={<RightOutlined />} onClick={() => history.push('/auth/register')}>
                                Bắt đầu ngay
                            </Button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img
                            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Hero illustration"
                        />
                    </div>
                </div>
            </div>
        </section>

      {/* Features */}
        <section className="features-section">
            <div className="container">
                <Title level={2}>Tính năng nổi bật</Title>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon-wrapper blue">
                            <CalendarOutlined style={{ fontSize: 24 }} />
                        </div>
                        <Title level={3}>Đặt lịch mượn dễ dàng</Title>
                        <Paragraph>
                             Sinh viên có thể dễ dàng đặt lịch mượn thiết bị với giao diện thân thiện, chọn ngày mượn và trả một cách linh hoạt.
                        </Paragraph>
                    </div>
                    <div className="feature-card">
                        <div className="icon-wrapper pink">
                            <ProfileOutlined style={{ fontSize: 24 }} />
                        </div>
                        <Title level={3}>Quản lý tồn kho thông minh</Title>
                        <Paragraph>
                            Quản trị viên có thể theo dõi tồn kho, cập nhật số lượng và tình trạng thiết bị một cách trực quan và hiệu quả.
                        </Paragraph>
                    </div>
                    <div className="feature-card">
                        <div className="icon-wrapper purple">
                            <CheckCircleOutlined style={{ fontSize: 24 }} />
                        </div>
                        <Title level={3}>Thông báo tự động</Title>
                        <Paragraph>
                            Hệ thống tự động gửi email thông báo khi yêu cầu được duyệt hoặc sắp đến hạn trả, giúp sinh viên không bỏ lỡ thông tin quan trọng.
                        </Paragraph>
                    </div>
                </div>
            </div>
        </section>

      {/* Dashboard Preview */}
        <section className="dashboard-section">
            <div className="container">
                <div className="grid-container">
                    <div>
                        <Title level={2}>Giao diện trực quan, dễ sử dụng</Title>
                        <Paragraph className="description">
                            Hệ thống được thiết kế với giao diện người dùng hiện đại, trực quan giúp sinh viên và quản trị viên dễ dàng sử dụng mà không cần đào tạo phức tạp.
                        </Paragraph>
                        <div className="feature-list">
                            {[
                                'Xem danh sách thiết bị có sẵn',
                                'Gửi yêu cầu mượn thiết bị',
                                'Theo dõi lịch sử mượn trả',
                                'Nhận thông báo tự động',
                                'Đánh giá thiết bị sau khi sử dụng',
                            ].map((item, index) => (
                                <div key={index} className="feature-item">
                                    <CheckCircleOutlined />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>                        <Button type="primary" onClick={() => history.push('/auth/login')}>
                            Khám phá thêm
                        </Button>
                    </div>
                    <div className="preview-image">
                        <img
                            src="https://media.istockphoto.com/id/1349476600/vi/vec-to/kh%C3%A1i-ni%E1%BB%87m-h%E1%BB%99i-tho%E1%BA%A1i-n%C3%B3i-chuy%E1%BB%87n.jpg?s=612x612&w=0&k=20&c=vOIfQBd_4qJJlYWHQkAhooJQFo5CykypORgroyaDhN4="
                            alt="Dashboard Preview"
                        />
                    </div>
                </div>
            </div>
        </section>      
        <Footer />
    </div>
  );
};

export default LandingPage;
