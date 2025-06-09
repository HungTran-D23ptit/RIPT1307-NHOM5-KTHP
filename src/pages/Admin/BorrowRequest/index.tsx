import React from 'react';
import { Tabs } from 'antd';
import PendingRequests from './components/PendingRequests';
import ApprovedRequests from './components/ApprovedRequests';
import RejectedRequests from './components/RejectedRequests';
import ReturningRequests from './components/ReturningRequests';
import './/index.less';

const { TabPane } = Tabs;

const BorrowRequestManagement: React.FC = () => {
  return (
    <div className="borrow-request-management-container">
      <h1>Quản lý yêu cầu mượn thiết bị</h1>
      <Tabs defaultActiveKey="pending">
        <TabPane tab="Chờ duyệt" key="pending">
          <PendingRequests />
        </TabPane>
        <TabPane tab="Đã duyệt" key="approved">
          <ApprovedRequests />
        </TabPane>
        <TabPane tab="Đã từ chối" key="rejected">
          <RejectedRequests />
        </TabPane>
        <TabPane tab="Đang trả" key="returning">
          <ReturningRequests />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BorrowRequestManagement;