import { useDeviceManagement } from '@/models/User/ThietBi';
import { DEVICE_TYPES } from '@/models/User/ThietBi/constants';
import { history } from 'umi';

import './index.less';

const ThietBi = () => {
	const { state, handleSearchChange, handleTypeChange, handleStatusChange, getStatusInfo, getDeviceTypeLabel } =
		useDeviceManagement();

	return (
		<div className='thiet-bi__container'>
			<h1 className='thiet-bi__title'>Danh sách thiết bị</h1>
			<div className='thiet-bi__subtitle'>Xem và mượn các thiết bị có sẵn</div>
			<div className='thiet-bi__top-bar'>
				<input
					className='thiet-bi__search-input'
					placeholder='Tìm kiếm thiết bị...'
					value={state.search}
					onChange={(e) => handleSearchChange(e.target.value)}
				/>
				<select className='thiet-bi__select' value={state.type} onChange={(e) => handleTypeChange(e.target.value)}>
					{DEVICE_TYPES.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<select className='thiet-bi__select' value={state.status} onChange={(e) => handleStatusChange(e.target.value)}>
					<option value=''>Tất cả tình trạng</option>
					<option value='NORMAL'>Có sẵn</option>
					<option value='MAINTENANCE'>Đang bảo trì</option>
				</select>
			</div>
			<div className='thiet-bi__grid'>
				{state.devices.map((device) => {
					const statusInfo = getStatusInfo(device);
					return (
						<div key={device._id} className='thiet-bi__card'>
							<img
								className='thiet-bi__card-image'
								src={device.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
								alt={device.name}
							/>
							<div className='thiet-bi__card-body'>
								<div className='thiet-bi__card-title'>
									{device.name}
									<span className={`thiet-bi__status-badge ${statusInfo.statusClass}`}>{statusInfo.status}</span>
								</div>
								<div className='thiet-bi__card-desc'>{device.description}</div>
								<div className='thiet-bi__card-info'>
									<span className='thiet-bi__card-info-label'>Loại:</span> {getDeviceTypeLabel(device.type)}
									<span className='thiet-bi__card-info-label'>Số lượng:</span> {device.quantity} sẵn có
								</div>
							</div>
							<div className='thiet-bi__card-footer'>
								<button
									className='thiet-bi__button thiet-bi__button--secondary'
									onClick={() => history.push(`/user/devices/${device._id}`)}
								>
									Chi tiết
								</button>
								<button
									className='thiet-bi__button thiet-bi__button--primary'
									disabled={!statusInfo.canBorrow}
									onClick={() => history.push(`/user/devices/${device._id}/borrow-requests`)}
								>
									{statusInfo.canBorrow ? 'Mượn ngay' : 'Không thể mượn'}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ThietBi;
