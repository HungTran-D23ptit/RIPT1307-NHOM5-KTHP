import { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Card, Button, Tag, Spin, Rate, Empty, Tooltip } from 'antd';
import { getDeviceById } from '@/services/User/Device';
import { StarFilled, ArrowLeftOutlined } from '@ant-design/icons';
import './Detail.less';

const statusMap = {
  NORMAL: { color: '#52c41a', text: 'Sẵn sàng để mượn' },
  MAINTENANCE: { color: '#faad14', text: 'Đang bảo trì' },
};

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getDeviceById(id);
        setDevice(res.data);
      } catch (e) {
        setDevice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} size="large" />;
  if (!device) return <Empty description="Không tìm thấy thiết bị" style={{ margin: '60px 0' }} />;

  return (
    <div className="thiet-bi__detail-modern-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined style={{ fontSize: 18 }} />}
        onClick={() => history.goBack()}
        className="thiet-bi__detail-back-btn"
      >
        Quay lại
      </Button>
      <Card
        className="thiet-bi__detail-card"
        bodyStyle={{ padding: 0 }}
        style={{ maxWidth: 950, margin: '0 auto', borderRadius: 18, boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)' }}
      >
        <div className="thiet-bi__detail-flexbox">
          <div className="thiet-bi__detail-img-wrap">
            <img
              src={device.image_url || 'https://via.placeholder.com/400x260?text=No+Image'}
              alt={device.name}
              className="thiet-bi__detail-img"
            />
          </div>
          <div className="thiet-bi__detail-info">
            <h2 className="thiet-bi__detail-title">{device.name}</h2>
            <div className="thiet-bi__detail-tags">
              <Tag color="blue">Mã: {device.code}</Tag>
              <Tag color="geekblue">Loại: {device.type}</Tag>
              <Tag style={{ background: statusMap[device.status as 'NORMAL' | 'MAINTENANCE']?.color, color: '#fff', border: 'none' }}>
                {statusMap[device.status as 'NORMAL' | 'MAINTENANCE']?.text || device.status}
              </Tag>
            </div>
            <div className="thiet-bi__detail-qty">Số lượng: <b>{device.quantity}</b></div>
            <div className="thiet-bi__detail-desc">Mô tả: {device.description || <span style={{ color: '#aaa' }}>Không có</span>}</div>
            <div className="thiet-bi__detail-rating">
              <b>Đánh giá trung bình:</b>{' '}
              {device.avg_rating ? (
                <Tooltip title={device.avg_rating.toFixed(2)}>
                  <Rate
                    disabled
                    value={device.avg_rating}
                    allowHalf
                    character={<StarFilled style={{ color: '#faad14', transition: 'transform 0.2s' }} />}
                    className="thiet-bi__detail-rate-hover"
                  />
                  <span style={{ marginLeft: 8, color: '#faad14', fontWeight: 500 }}>{device.avg_rating.toFixed(2)}</span>
                </Tooltip>
              ) : (
                <span style={{ color: '#aaa' }}>Chưa có đánh giá</span>
              )}
            </div>
            <Button
              type="primary"
              size="large"
              className="thiet-bi__detail-borrow-btn"
              disabled={device.status !== 'NORMAL' || device.quantity < 1}
              onClick={() => history.push(`/user/devices/${device._id}/borrow-requests`)}
            >
              Mượn ngay
            </Button>
          </div>
        </div>
        <div className="thiet-bi__detail-review-block">
          <h3>Đánh giá thiết bị</h3>
          {device.reviews?.total === 0 ? (
            <Empty description="Chưa có đánh giá nào" />
          ) : (
            <div className="thiet-bi__detail-review-list">
              {device.reviews.data.map((review: any) => (
                <Card key={review._id} className="thiet-bi__detail-review-item">
                  <div className="thiet-bi__detail-review-flex">
                    <img
                      src={review.user?.avatar || 'https://via.placeholder.com/40'}
                      alt="avatar"
                      className="thiet-bi__detail-review-avatar"
                    />
                    <div>
                      <b>{review.user?.full_name || 'Người dùng'}</b>
                      <div className="thiet-bi__detail-review-stars">
                        <Rate disabled value={review.rating} character={<StarFilled style={{ color: '#faad14' }} />} />
                        <span style={{ marginLeft: 6, color: '#faad14' }}>{review.rating}</span>
                      </div>
                      <div className="thiet-bi__detail-review-comment">{review.comment}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Detail; 