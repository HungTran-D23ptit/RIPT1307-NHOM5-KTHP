import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Modal, Input } from 'antd';
import { getBorrowRequests, approveBorrowRequest, rejectBorrowRequest } from '@/services/Admin/borrowRequest';
import moment from 'moment';
import AdminRequestDetail from './AdminRequestDetail';

interface PendingRequest {
  _id: string;
  user: { name: string };
  device: { name: string };
  quantity: number;
  borrow_date: string;
  return_date: string;
  status: string;
  createdAt: string;
}

const PendingRequests: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PendingRequest[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getBorrowRequests({
        status: 'PENDING',
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
      message.error('Không thể tải danh sách yêu cầu chờ duyệt');
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

  const handleApprove = async (id: string) => {
    setLoading(true);
    try {
      await approveBorrowRequest(id);
      message.success('Duyệt đơn mượn thành công');
      fetchData(pagination.current, pagination.pageSize); // Refresh data
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Duyệt đơn mượn thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    if (selectedRequestId) {
      setLoading(true);
      try {
        await rejectBorrowRequest(selectedRequestId, rejectReason);
        message.success('Từ chối đơn mượn thành công');
        setIsRejectModalVisible(false);
        setRejectReason('');
        setSelectedRequestId(null);
        fetchData(pagination.current, pagination.pageSize); // Refresh data
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Từ chối đơn mượn thất bại');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRejectCancel = () => {
    setIsRejectModalVisible(false);
    setRejectReason('');
    setSelectedRequestId(null);
  };

  const handleViewDetail = (id: string) => {
    setDetailRequestId(id);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailRequestId(null);
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
      render: (status: string) => <Tag color="orange">Chờ duyệt</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: PendingRequest) => (
        <span>
          <Button style={{ marginRight: 8 }} onClick={() => handleViewDetail(record._id)}>Chi tiết</Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleApprove(record._id)}>Duyệt</Button>
          <Button danger onClick={() => handleReject(record._id)}>Từ chối</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title="Lý do từ chối"
        visible={isRejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={handleRejectCancel}
        confirmLoading={loading}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
      >
        <p>Vui lòng nhập lý do từ chối</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
        />
      </Modal>
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

export default PendingRequests; 