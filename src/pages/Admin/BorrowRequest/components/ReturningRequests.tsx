import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Modal } from 'antd';
import { getBorrowRequests, BorrowingDevice } from '@/services/Admin/borrowRequest';
import moment from 'moment';
import { history } from 'umi';
import request from '@/utils/request';
import AdminRequestDetail from './AdminRequestDetail';

const ReturningRequests: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BorrowingDevice[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getBorrowRequests({ 
        status: 'RETURNING',
        page, 
        per_page: pageSize 
      });
      setData(response.data.requests);
      setPagination({
        current: response.data.page,
        pageSize: response.data.per_page,
        total: response.data.total,
      });
    } catch (error) {
      message.error('Không thể tải danh sách yêu cầu đang trả');
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

  const handleConfirmReturn = async (id: string) => {
    try {
      await request(`/admin/borrow-requests/${id}/confirm-return`, {
        method: 'PATCH',
      });
      message.success('Xác nhận trả thiết bị thành công');
      fetchData(pagination.current, pagination.pageSize); // Refresh lại dữ liệu
    } catch (error) {
      message.error('Xác nhận trả thiết bị thất bại');
    }
  };

  const handleViewDetail = (id: string) => {
    setDetailRequestId(id);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailRequestId(null);
    fetchData(pagination.current, pagination.pageSize); // Refresh data after closing detail
  };

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: '_id',
      key: '_id',
      width: 200,
      render: (text: string) => (
        <Tag color="purple">{text}</Tag>
      ),
    },
    {
      title: 'Thiết bị',
      dataIndex: ['device', 'name'],
      key: 'device',
      width: 300,
      render: (text: string, record: BorrowingDevice) => (
        <Space>
          <div>
            <div>{text}</div>
            <div style={{ fontSize: 12, color: '#666' }}>Mã: {record.device.code}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Người mượn',
      dataIndex: ['user', 'name'],
      key: 'user',
      width: 200,
      render: (text: string, record: BorrowingDevice) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.user.email}</div>
        </div>
      ),
    },
    {
      title: 'S.lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
      render: (text: number) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrow_date',
      key: 'borrow_date',
      width: 80,
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày trả',
      dataIndex: 'return_date',
      key: 'return_date',
      width: 80,
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    // {
    //   title: 'Lý do',
    //   dataIndex: 'reason',
    //   key: 'reason',
    //   ellipsis: true,
    // },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: unknown, record: BorrowingDevice) => (
        <Space>
          <Button onClick={() => handleViewDetail(record._id)}>Chi tiết</Button>
          <Button 
            type="primary"
            onClick={() => handleConfirmReturn(record._id)}
          >
            Xác nhận trả
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {showDetailModal && detailRequestId && (
        <Modal
          title="Chi tiết yêu cầu mượn"
          visible={showDetailModal}
          onCancel={handleCloseDetailModal}
          footer={null}
          width={900}
          centered
        >
          <AdminRequestDetail requestId={detailRequestId} onBack={handleCloseDetailModal} />
        </Modal>
      )}
    </>
  );
};

export default ReturningRequests; 