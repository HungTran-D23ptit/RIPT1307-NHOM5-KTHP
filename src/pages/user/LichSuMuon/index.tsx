import { useHistoryBorrowModel } from '@/models/User/AllRequest/useHistoryBorrowModel';
import { Input, Modal, Rate, Tooltip } from 'antd';
import React from 'react';
import './index.less';

const LichSuMuon: React.FC = () => {
	const {
		allRecords,
		filteredRecords,
		isModalVisible,
		selectedRecord,
		note,
		rating,
		loading,
		reviewCount,
		keyword,
		filterTime,
		filterStatus,
		formatDate,
		handleFilterChange,
		openReviewModal,
		handleReviewSubmit,
		setNote,
		setRating,
		setIsModalVisible,
	} = useHistoryBorrowModel();

	return (
		<div className='lich-su-muon'>
			<h1 className='title'>Lịch sử mượn thiết bị</h1>
			<p className='subtitle'>Xem lại các thiết bị bạn đã mượn trước đây</p>

			{/* Bộ lọc */}
			<div className='filter-container'>
				<input
					type='text'
					placeholder='Tìm kiếm lịch sử...'
					value={keyword}
					onChange={(e) => handleFilterChange(e.target.value, filterTime, filterStatus)}
				/>
				<select value={filterTime} onChange={(e) => handleFilterChange(keyword, e.target.value, filterStatus)}>
					<option value='all'>Tất cả thời gian</option>
					<option value='7days'>7 ngày qua</option>
					<option value='thismonth'>Tháng này</option>
				</select>
				<select value={filterStatus} onChange={(e) => handleFilterChange(keyword, filterTime, e.target.value)}>
					<option value='all'>Tất cả trạng thái</option>
					<option value='approved'>Đang mượn</option>
					<option value='returned'>Đã trả</option>
					<option value='overdue'>Quá hạn</option>
				</select>
			</div>

			{/* Thống kê */}
			<div className='stats'>
				<div className='stat-card'>
					<div className='label'>Tổng lượt mượn</div>
					<div className='value'>{allRecords.length}</div>
				</div>
				<div className='stat-card green'>
					<div className='label'>Trả đúng hạn</div>
					<div className='value'>{allRecords.filter((r) => r.status === 'RETURNED').length}</div>
				</div>
				<div className='stat-card yellow'>
					<div className='label'>Trả trễ</div>
					<div className='value'>{allRecords.filter((r) => r.status === 'OVERDUE').length}</div>
				</div>
				<div className='stat-card pink'>
					<div className='label'>Đã đánh giá</div>
					<div className='value'>{reviewCount}</div>
				</div>
			</div>

			{/* Bảng dữ liệu */}
			<div className='table-container'>
				<table>
					<thead>
						<tr>
							<th>Số thứ tự</th>
							<th>Thiết bị</th>
							<th>Ngày mượn</th>
							<th>Ngày trả</th>
							<th>Trạng thái</th>
							<th>Đánh giá</th>
						</tr>
					</thead>
					<tbody>
						{filteredRecords.map((item, index) => (
							<tr key={item._id}>
								<td>{String(index + 1).padStart(2, '0')}</td>
								<td>{item.device?.name || 'Thiết bị không tồn tại'}</td>
								<td>{formatDate(item.borrow_date)}</td>
								<td>{formatDate(item.return_date)}</td>
								<td>
									<span
										className={`badge ${
											item.status === 'APPROVED' ? 'approved' : item.status === 'RETURNED' ? 'returned' : 'late'
										}`}
									>
										{item.status === 'APPROVED' ? 'Đang mượn' : item.status === 'RETURNED' ? 'Đã trả' : 'Quá hạn'}
									</span>
								</td>
								<td>
									{item.rating ? (
										<div className='review-display'>
											<Rate disabled value={item.rating} />
											<p className='review-comment'>{item.note}</p>
										</div>
									) : item.status === 'RETURNED' ? (
										<button className='btn-rate' onClick={() => openReviewModal(item)}>
											Đánh giá
										</button>
									) : (
										<Tooltip title='Chỉ có thể đánh giá khi thiết bị đã được trả'>
											<button className='btn-rate disabled' disabled>
												Đánh giá
											</button>
										</Tooltip>
									)}
								</td>
							</tr>
						))}
						{filteredRecords.length === 0 && (
							<tr>
								<td colSpan={6} className='no-data'>
									Không có dữ liệu phù hợp.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Modal đánh giá */}
			<Modal
				title='Đánh giá thiết bị đã mượn'
				open={isModalVisible}
				onOk={handleReviewSubmit}
				onCancel={() => setIsModalVisible(false)}
				okText='Gửi đánh giá'
				cancelText='Hủy'
				confirmLoading={loading}
			>
				<p>
					<strong>Thiết bị:</strong> {selectedRecord?.device?.name || 'N/A'}
				</p>
				<Rate value={rating} onChange={setRating} allowClear={false} />
				<Input.TextArea
					rows={4}
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder='Nhận xét thêm (tùy chọn)...'
					maxLength={1000}
					style={{ marginTop: 12 }}
				/>
			</Modal>
		</div>
	);
};

export default LichSuMuon;
