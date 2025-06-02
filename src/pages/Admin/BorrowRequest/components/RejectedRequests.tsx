import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message } from 'antd';
import { getBorrowRequests } from '@/services/Admin/borrowRequest';
import moment from 'moment';

interface RejectedRequest {
  _id: string;
  user: { name: string };
  device: { name: string };
  quantity: number;
  borrow_date: string;
  return_date: string;
  status: string;
  createdAt: string;
  note?: string; // Thêm trường ghi chú từ chối
}

const RejectedRequests: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RejectedRequest[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getBorrowRequests({
        status: 'REJECTED',
        page,
        per_page: pageSize,
      });
      setData(response.data.requests);
      setPagination({
        current: response.data.page,
        pageSize: response.data.per_page,
        total: response.data.total,
      });
    } catch (error) {
      message.error('Không thể tải danh sách yêu cầu đã từ chối');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Đơn vị',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Thiết bị',
      dataIndex: ['device', 'name'],
      key: 'device',
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrow_date',
      key: 'borrow_date',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày trả',
      dataIndex: 'return_date',
      key: 'return_date',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="red">Đã từ chối</Tag>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: RejectedRequest) => (
        <span>
          {/* Add actions for rejected requests here, e.g., View Detail */}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="_id"
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};

export default RejectedRequests; 