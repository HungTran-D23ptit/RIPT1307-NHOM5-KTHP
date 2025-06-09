import { Row, Col, Button} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomeService from '@/services/User/Home/HomeService';
import { CurrentBorrowing } from '@/services/User/Home/typing';
import RequestCard from '@/pages/user/YeuCauMuon/components/RequestCard';
import RequestDetail from '@/pages/user/YeuCauMuon/components/RequestDetail';
import type { BorrowRequest } from '@/services/User/AllRequest/FEtyping';

const CurrentBorrowings = () => {
  const history = useHistory();
  const [borrowings, setBorrowings] = useState<CurrentBorrowing[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CurrentBorrowing | null>(null);
  const [showDetailPage, setShowDetailPage] = useState(false);

  const fetchBorrowings = async () => {
    try {
      const data = await HomeService.getCurrentBorrowings();
      console.log('Raw borrowings data from API:', data);
      console.log('Total borrowings:', data.length);
      console.log('Return status for each borrowing:', data.map(b => ({
        deviceName: b.device.name,
        returnDate: b.return_date,
        returnStatus: b.returnStatus,
        daysRemaining: b.daysRemaining
      })));
      setBorrowings(data);
    } catch (error) {
      console.error('Error fetching current borrowings:', error);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleViewAll = () => {
    history.push('/user/borrow-requests/');
  };

  const handleViewDetail = (item: BorrowRequest | CurrentBorrowing) => {
    if ('returnStatus' in item && 'daysRemaining' in item) {
      setSelectedRequest(item as CurrentBorrowing);
      setShowDetailPage(true);
    }
  };

  const handleBack = () => {
    setShowDetailPage(false);
    setSelectedRequest(null);
    fetchBorrowings();
  };

  const handleRequestUpdate = () => {
    fetchBorrowings();
  };

  if (showDetailPage && selectedRequest) {
    return <RequestDetail requestId={selectedRequest._id} onBack={handleBack} />;
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <Row justify="space-between" style={{ marginBottom: '16px' }}>
        <Col>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <ShoppingCartOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
            Thiết bị đang mượn
          </h2>
        </Col>
        <Col>
          <Button type="link" onClick={handleViewAll}>Xem tất cả</Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {borrowings.map((borrowing) => (
          <Col xs={24} lg={12} key={borrowing._id}>
            <RequestCard 
              item={borrowing}
              onViewDetail={handleViewDetail}
              onRequestUpdate={handleRequestUpdate}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CurrentBorrowings;