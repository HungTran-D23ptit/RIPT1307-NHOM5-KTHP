import { Row, Col, Card} from 'antd';
import { BarChartOutlined, ShoppingCartOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined, StarFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { BorrowingStats } from '@/services/User/Home/typing';
import './StatsOverview.less';

const StatsOverview = () => {
  const [stats, setStats] = useState<BorrowingStats>({
    totalBorrowed: 0,
    totalReturned: 0,
    pendingApproval: 0,
    overdue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await HomeService.getBorrowingStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="stats-overview">
      <h2 className="title">
        <BarChartOutlined className="icon" />
        <span>Tổng quan hoạt động</span>
      </h2>
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} lg={6}>
          <Card className="stat-card borrowing">
            <div className="stat-content">
              <div className="stat-info">
                <p className="label">Đang mượn</p>
                <p className="value">{stats.totalBorrowed}</p>
                <p className="unit">thiết bị</p>
              </div>
              <div className="icon-circle borrowing">
                <ShoppingCartOutlined className="icon" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card className="stat-card returned">
            <div className="stat-content">
              <div className="stat-info">
                <p className="label">Đã trả</p>
                <p className="value">{stats.totalReturned}</p>
                <p className="unit">thiết bị</p>
              </div>
              <div className="icon-circle returned">
                <CheckCircleOutlined className="icon" />
              </div>
            </div>
            <div className="rating">
              <p className="label">Đánh giá trung bình</p>
              <div className="stars">
                <StarFilled className="star" />
                <StarFilled className="star" />
                <StarFilled className="star" />
                <StarFilled className="star" />
                <StarFilled className="star" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card className="stat-card pending">
            <div className="stat-content">
              <div className="stat-info">
                <p className="label">Chờ duyệt</p>
                <p className="value">{stats.pendingApproval}</p>
                <p className="unit">yêu cầu</p>
              </div>
              <div className="icon-circle pending">
                <ClockCircleOutlined className="icon" />
              </div>
            </div>
            <p className="note">Thời gian chờ trung bình: 2 giờ</p>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card className="stat-card overdue">
            <div className="stat-content">
              <div className="stat-info">
                <p className="label">Quá hạn</p>
                <p className="value">{stats.overdue}</p>
                <p className="unit">thiết bị</p>
              </div>
              <div className="icon-circle overdue">
                <AlertOutlined className="icon" />
              </div>
            </div>
            <p className="note">
              {stats.overdue === 0 ? 'Tuyệt vời! Không có thiết bị quá hạn' : 'Có thiết bị cần trả gấp'}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsOverview; 