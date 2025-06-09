import { Row, Col, Card} from 'antd';
import { BarChartOutlined, ShoppingCartOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined, StarFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { BorrowingStats } from '@/services/User/Home/typing';

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
    <div style={{ marginBottom: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
        <BarChartOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
        <span>Tổng quan hoạt động</span>
      </h2>
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ background: 'linear-gradient(to bottom right, #1976D2, #1565C0)', color: '#fff', borderRadius: '8px', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#fff', fontSize: '12px', margin: '0 0 4px' }}>Đang mượn</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.totalBorrowed}</p>
                <p style={{ color: '#fff', fontSize: '12px', margin: '4px 0 0' }}>thiết bị</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#42A5F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ background: 'linear-gradient(to bottom right, #388E3C, #2E7D32)', color: '#fff', borderRadius: '8px', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#fff', fontSize: '12px', margin: '0 0 4px' }}>Đã trả</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.totalReturned}</p>
                <p style={{ color: '#fff', fontSize: '12px', margin: '4px 0 0' }}>thiết bị</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#66BB6A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <div style={{ marginTop: '4px' }}>
              <p style={{ color: '#fff', fontSize: '12px', margin: '0 0 4px' }}>Đánh giá trung bình</p>
              <div style={{ display: 'flex', gap: '4px' }}>
                <StarFilled style={{ fontSize: '12px', color: '#FFD700' }} />
                <StarFilled style={{ fontSize: '12px', color: '#FFD700' }} />
                <StarFilled style={{ fontSize: '12px', color: '#FFD700' }} />
                <StarFilled style={{ fontSize: '12px', color: '#FFD700' }} />
                <StarFilled style={{ fontSize: '12px', color: '#FFD700' }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ background: 'linear-gradient(to bottom right, #FFA000, #FF8F00)', color: '#fff', borderRadius: '8px', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#fff', fontSize: '12px', margin: '0 0 4px' }}>Chờ duyệt</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.pendingApproval}</p>
                <p style={{ color: '#fff', fontSize: '12px', margin: '4px 0 0' }}>yêu cầu</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#FFCA28', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClockCircleOutlined style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <p style={{ color: '#fff', fontSize: '12px', margin: '4px 0 0' }}>Thời gian chờ trung bình: 2 giờ</p>
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card style={{ background: 'linear-gradient(to bottom right, #D32F2F, #C62828)', color: '#fff', borderRadius: '8px', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#fff', fontSize: '12px', margin: '0 0 4px' }}>Quá hạn</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.overdue}</p>
                <p style={{ color: '#fff', fontSize: '12px', margin: '4px 0 0' }}>thiết bị</p>
              </div>
              <div style={{ width: '48px', height: '48px', background: '#EF5350', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertOutlined style={{ fontSize: '24px', color: '#fff' }} />
              </div>
            </div>
            <p style={{ color: '#fff', fontSize: '12px', margin: '4px 0 0' }}>
              {stats.overdue === 0 ? 'Tuyệt vời! Không có thiết bị quá hạn' : 'Có thiết bị cần trả gấp'}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsOverview; 