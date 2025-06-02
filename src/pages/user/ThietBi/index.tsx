import { useEffect, useState } from 'react';
import { getDevices } from '@/services/User/Device';
import { DeviceResponse } from '@/services/User/Device/typing';
import { message } from 'antd';
import { history } from 'umi';

import './index.less';

const ThietBi = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [devices, setDevices] = useState<DeviceResponse[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await getDevices({
          search,
          type: type || undefined,
          status: status || undefined,
        });
        setDevices(response.data.data);
      } catch (error) {
        message.error('Không thể tải danh sách thiết bị');
      }
    };

    fetchDevices();
  }, [search, type, status]);

  const getStatusInfo = (device: DeviceResponse) => {
    if (device.status === 'NORMAL' && device.quantity > 0) {
      return {
        status: 'Có sẵn',
        statusClass: 'thiet-bi__status-badge--available',
        canBorrow: true
      };
    } else if (device.status === 'NORMAL' && device.quantity === 0) {
      return {
        status: 'Hết hàng',
        statusClass: 'thiet-bi__status-badge--out-of-stock',
        canBorrow: false
      };
    } else {
      return {
        status: 'Đang bảo trì',
        statusClass: 'thiet-bi__status-badge--maintenance',
        canBorrow: false
      };
    }
  };

  return (
    <div className="thiet-bi__container">
      <h1 className="thiet-bi__title">Danh sách thiết bị</h1>
      <div className="thiet-bi__subtitle">Xem và mượn các thiết bị có sẵn</div>
      <div className="thiet-bi__top-bar">
        <input
          className="thiet-bi__search-input"
          placeholder="Tìm kiếm thiết bị..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="thiet-bi__select" value={type} onChange={e => setType(e.target.value)}>
          <option value="">Tất cả thiết bị</option>
          <option value="Camera Recorder">Máy quay</option>
          <option value="Camera">Máy ảnh</option>
          <option value="Microphone">Micro</option>
          <option value="LED Studio Light">Đèn LED</option>
          <option value="Computer">Máy tính</option>
          <option value="Projector">Máy chiếu</option>
          <option value="Other">Khác</option>
        </select>
        <select className="thiet-bi__select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tất cả tình trạng</option>
          <option value="NORMAL">Có sẵn</option>
          <option value="MAINTENANCE">Đang bảo trì</option>
        </select>
      </div>
      <div className="thiet-bi__grid">
        {devices.map(device => {
          const statusInfo = getStatusInfo(device);
          return (
            <div key={device._id} className="thiet-bi__card">
              <img 
                className="thiet-bi__card-image"
                src={device.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={device.name} 
              />
              <div className="thiet-bi__card-body">
                <div className="thiet-bi__card-title">
                  {device.name}
                  <span className={`thiet-bi__status-badge ${statusInfo.statusClass}`}>
                    {statusInfo.status}
                  </span>
                </div>
                <div className="thiet-bi__card-desc">{device.description}</div>
                <div className="thiet-bi__card-info">
                  <span className="thiet-bi__card-info-label">Loại:</span> {device.type}
                  <span className="thiet-bi__card-info-label">Số lượng:</span> {device.quantity} sẵn có
                </div>
              </div>
              <div className="thiet-bi__card-footer">
                <button 
                  className="thiet-bi__button thiet-bi__button--secondary"
                  onClick={() => history.push(`/user/devices/${device._id}`)}
                >Chi tiết</button>
                <button 
                  className="thiet-bi__button thiet-bi__button--primary" 
                  disabled={!statusInfo.canBorrow}
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
}

export default ThietBi;