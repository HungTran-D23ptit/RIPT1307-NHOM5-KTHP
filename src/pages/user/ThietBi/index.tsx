import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDevices } from '@/services/User/Device';
import { DeviceResponse } from '@/services/User/Device/typing';
import { message } from 'antd';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 0;
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;
const Subtitle = styled.div`
  color: #666;
  margin-bottom: 2rem;
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;
const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1.5px solid #e53935;
  border-radius: 4px;
  outline: none;
  width: 220px;
`;
const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px 20px;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const CardImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;
const CardBody = styled.div`
  padding: 18px 16px 12px 16px;
  flex: 1;
`;
const CardTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
`;
const StatusBadge = styled.span<{bg:string, color:string}>`
  background: ${props => props.bg};
  color: ${props => props.color};
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 10px;
  margin-left: 8px;
`;
const CardDesc = styled.div`
  color: #666;
  font-size: 0.98rem;
  margin-bottom: 10px;
`;
const CardInfo = styled.div`
  font-size: 0.97rem;
  margin-bottom: 8px;
  display: flex;
  gap: 18px;
`;
const CardInfoLabel = styled.span`
  color: #888;
`;
const CardFooter = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 16px 14px 16px;
`;
const Button = styled.button<{primary?:boolean, disabled?:boolean}>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  background: ${props => props.primary ? '#d32f2f' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#222'};
  border: ${props => props.primary ? 'none' : '1.5px solid #ccc'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: background 0.2s;
  &:hover {
    background: ${props => props.primary && !props.disabled ? '#b71c1c' : '#f5f5f5'};
  }
`;

const ThietBi = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await getDevices({
          search,
          type: type || undefined,
          status: status || undefined,
        });
        setDevices(response.data.data);
      } catch (error) {
        message.error('Không thể tải danh sách thiết bị');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [search, type, status]);

  const getStatusInfo = (device: DeviceResponse) => {
    if (device.status === 'NORMAL' && device.quantity > 0) {
      return {
        status: 'Có sẵn',
        statusColor: '#e6ffe6',
        statusTextColor: '#2e7d32',
        canBorrow: true
      };
    } else if (device.status === 'NORMAL' && device.quantity === 0) {
      return {
        status: 'Hết hàng',
        statusColor: '#ffd6d6',
        statusTextColor: '#c62828',
        canBorrow: false
      };
    } else {
      return {
        status: 'Đang bảo trì',
        statusColor: '#ffe6a1',
        statusTextColor: '#b38b00',
        canBorrow: false
      };
    }
  };

  return (
    <Container>
      <Title>Danh sách thiết bị</Title>
      <Subtitle>Xem và mượn các thiết bị có sẵn</Subtitle>
      <TopBar>
        <SearchInput
          placeholder="Tìm kiếm thiết bị..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Tất cả thiết bị</option>
          <option value="Camera Recorder">Máy quay</option>
          <option value="Camera">Máy ảnh</option>
          <option value="Microphone">Micro</option>
          <option value="LED Studio Light">Đèn LED</option>
          <option value="Computer">Máy tính</option>
          <option value="Projector">Máy chiếu</option>
          <option value="Other">Khác</option>
        </Select>
        <Select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Tất cả tình trạng</option>
          <option value="NORMAL">Có sẵn</option>
          <option value="MAINTENANCE">Đang bảo trì</option>
        </Select>
      </TopBar>
      <Grid>
        {devices.map(device => {
          const statusInfo = getStatusInfo(device);
          return (
            <Card key={device._id}>
              <CardImage 
                src={device.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={device.name} 
              />
              <CardBody>
                <CardTitle>
                  {device.name}
                  <StatusBadge bg={statusInfo.statusColor} color={statusInfo.statusTextColor}>
                    {statusInfo.status}
                  </StatusBadge>
                </CardTitle>
                <CardDesc>{device.description}</CardDesc>
                <CardInfo>
                  <CardInfoLabel>Loại:</CardInfoLabel> {device.type}
                  <CardInfoLabel>Số lượng:</CardInfoLabel> {device.quantity} sẵn có
                </CardInfo>
              </CardBody>
              <CardFooter>
                <Button>Chi tiết</Button>
                <Button primary disabled={!statusInfo.canBorrow}>
                  {statusInfo.canBorrow ? 'Mượn ngay' : 'Không thể mượn'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </Grid>
    </Container>
  );
}

export default ThietBi;