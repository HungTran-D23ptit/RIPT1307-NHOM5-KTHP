import React from 'react';
import { useAdminHomeData } from '../../../models/Admin/Home';
import './index.less';
import QuickActions from './QuickActions';
import { AppstoreOutlined, HistoryOutlined, PieChartOutlined } from '@ant-design/icons';

const TrangChuAdminPage: React.FC = () => {
	const { borrowStats, adminLogs, deviceTypeStats, deviceTotalStats, loading, error } = useAdminHomeData();

	if (loading) return <div className='admin-loading'>Đang tải dữ liệu...</div>;
	if (error) return <div className='admin-error'>{error}</div>;

	return (
		<div className='admin-home'>
			<h1 className='page-title'>Trang chủ quản trị</h1>

			{/* Quick Actions */}
			<QuickActions />

			{/* Tổng quan thiết bị */}
			<section className='section greeting-section'>
				<h2 className='section-title'>
					<PieChartOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
					<span>Tổng quan thiết bị</span>
				</h2>
				<div className='greeting-stats'>
					<div className='card total'>
						<p>Thiết bị tổng</p>
						<h3>{deviceTotalStats?.total ?? 0}</h3>
					</div>
					<div className='card returning'>
						<p>Đang cho mượn</p>
						<h3>{borrowStats?.RETURNING ?? 0}</h3>
					</div>
					<div className='card pending'>
						<p>Chờ duyệt</p>
						<h3>{borrowStats?.PENDING ?? 0}</h3>
					</div>
					<div className='card overdue'>
						<p>Quá hạn</p>
						<h3>{borrowStats?.OVERDUE ?? 0}</h3>
					</div>
				</div>
			</section>

			{/* Thống kê thiết bị theo loại */}
			<section className='section'>
				<h2 className='section-title'>
					<AppstoreOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
					<span>Thống kê thiết bị theo loại</span>
				</h2>
				{deviceTypeStats.length > 0 ? (
					<div className='type-grid'>
						{deviceTypeStats.map(({ type, count }) => (
							<div key={type} className='type-box'>
								<span className='type-name'>{type}</span>
								<span className='type-count'>{count}</span>
							</div>
						))}
					</div>
				) : (
					<p>Không có dữ liệu</p>
				)}
			</section>

			{/* Hoạt động gần đây */}
			<section className='section recent-activities'>
				<h2 className='section-title'>
					<HistoryOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
					<span>Hoạt động gần đây</span>
				</h2>
				{adminLogs?.data?.length > 0 ? (
					<div className='activity-list'>
						{adminLogs.data.map((log) => (
							<div className='activity-item' key={log._id}>
								<div className='activity-icon'>
									<HistoryOutlined />
								</div>
								<div className='activity-info'>
									<div className='activity-header'>
										<span className='admin-name'>{log.admin_id?.name ?? 'Không rõ'}</span>
										<span className='action-time'>{new Date(log.created_at).toLocaleString()}</span>
									</div>
									<div className='activity-action'>{log.action}</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='empty-text'>Chưa có hoạt động nào.</p>
				)}
			</section>
		</div>
	);
};

export default TrangChuAdminPage;
