import { useDeviceDetail } from '@/models/User/ThietBi/detail';
import { ArrowLeftOutlined, StarFilled, ZoomInOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Modal, Rate, Spin, Tag, Tooltip } from 'antd';
import { history, useParams } from 'umi';
import { API_URL } from '@/config/config';
import { getImageUrl } from '@/utils/utils';
import './Detail.less';

const Detail = () => {
	const { id } = useParams<{ id: string }>();
	const { loading, device, isImageModalVisible, toggleImageModal, canBorrow, statusMap } = useDeviceDetail(id);

	if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} size='large' />;
	if (!device) return <Empty description='Không tìm thấy thiết bị' style={{ margin: '60px 0' }} />;

	return (
		<div className='thiet-bi__detail-modern-container'>
			<Button
				type='text'
				icon={<ArrowLeftOutlined style={{ fontSize: 18 }} />}
				onClick={() => history.goBack()}
				className='thiet-bi__detail-back-btn'
			>
				Quay lại
			</Button>
			<Card
				className='thiet-bi__detail-card'
				bodyStyle={{ padding: 0 }}
				style={{ maxWidth: 950, margin: '0 auto', borderRadius: 18, boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)' }}
			>
				<div className='thiet-bi__detail-flexbox'>
					<div className='thiet-bi__detail-img-wrap' onClick={toggleImageModal}>
						<img
							src={getImageUrl(device.image_url) || 'https://via.placeholder.com/400x260?text=No+Image'}
							alt={device.name}
							className='thiet-bi__detail-img'
						/>
						<div className='thiet-bi__detail-img-overlay'>
							<ZoomInOutlined className='zoom-icon' />
							<span>Click để xem ảnh lớn</span>
						</div>
					</div>
					<div className='thiet-bi__detail-info'>
						<h2 className='thiet-bi__detail-title'>{device.name}</h2>
						<div className='thiet-bi__detail-tags'>
							<Tag color='blue'>Mã: {device.code}</Tag>
							<Tag color='geekblue'>Loại: {device.type}</Tag>
							<Tag style={{ background: statusMap[device.status]?.color, color: '#fff', border: 'none' }}>
								{statusMap[device.status]?.text || device.status}
							</Tag>
						</div>
						<div className='thiet-bi__detail-qty'>
							Số lượng: <b>{device.quantity}</b>
						</div>
						<div className='thiet-bi__detail-desc'>
							Mô tả: {device.description || <span style={{ color: '#aaa' }}>Không có</span>}
						</div>
						<div className='thiet-bi__detail-rating'>
							<b>Đánh giá trung bình:</b>{' '}
							{device.avg_rating ? (
								<Tooltip title={device.avg_rating.toFixed(2)}>
									<Rate
										disabled
										value={device.avg_rating}
										allowHalf
										character={<StarFilled style={{ color: '#faad14', transition: 'transform 0.2s' }} />}
										className='thiet-bi__detail-rate-hover'
									/>
									<span style={{ marginLeft: 8, color: '#faad14', fontWeight: 500 }}>
										{device.avg_rating.toFixed(2)}
									</span>
								</Tooltip>
							) : (
								<span style={{ color: '#aaa' }}>Chưa có đánh giá</span>
							)}
						</div>
						<Button
							type='primary'
							size='large'
							className='thiet-bi__detail-borrow-btn'
							disabled={!canBorrow}
							onClick={() => history.push(`/user/devices/${device._id}/borrow-requests`)}
						>
							Mượn ngay
						</Button>
					</div>
				</div>
				<div className='thiet-bi__detail-review-block'>
					<h3>Đánh giá thiết bị</h3>
					{!device.reviews || device.reviews?.total === 0 ? (
						<Empty description='Chưa có đánh giá nào' />
					) : (
						<div className='thiet-bi__detail-review-list'>
							{device.reviews?.data?.map((review) => (
								<Card key={review._id} className='thiet-bi__detail-review-item'>
									<div className='thiet-bi__detail-review-flex'>
										<img
											src={getImageUrl(review.user?.avatar) || 'https://via.placeholder.com/40'}
											alt='avatar'
											className='thiet-bi__detail-review-avatar'
										/>
										<div>
											<b>{review.user?.name || 'Người dùng'}</b>
											<div className='thiet-bi__detail-review-stars'>
												<Rate disabled value={review.rating} character={<StarFilled style={{ color: '#faad14' }} />} />
												<span style={{ marginLeft: 6, color: '#faad14' }}>{review.rating}</span>
											</div>
											<div className='thiet-bi__detail-review-comment'>{review.comment}</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</Card>

			<Modal
				open={isImageModalVisible}
				onCancel={toggleImageModal}
				footer={null}
				width='80%'
				centered
				className='image-modal'
			>
				<img
					src={getImageUrl(device.image_url) || 'https://via.placeholder.com/400x260?text=No+Image'}
					alt={device.name}
					style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
				/>
			</Modal>
		</div>
	);
};

export default Detail;
