import { useState, useEffect } from 'react';
import { Card, Tabs, Row, Col, Space, Input, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import RequestCard from './components/RequestCard';
import RequestDetail from './components/RequestDetail';
import { getBorrowRequests } from '@/models/User/AllRequest';
import { filterRequestsBySearch } from '@/models/User/AllRequest/utils';
import type { BorrowRequest } from '@/services/User/AllRequest/FEtyping';

const { TabPane } = Tabs;

const YeuCauMuon: React.FC = () => {
    const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);
    const [showDetailPage, setShowDetailPage] = useState(false);
    const [requests, setRequests] = useState<BorrowRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState('PENDING');
    const [searchText, setSearchText] = useState('');

    const fetchRequests = async (status = currentTab) => {
        setLoading(true);
        try {
            const response = await getBorrowRequests({
                status,
                page: 1,
                per_page: 10,
            });
            if (status === 'APPROVED') {
                const returningResponse = await getBorrowRequests({
                    status: 'RETURNING',
                    page: 1,
                    per_page: 10,
                });
                const overdueResponse = await getBorrowRequests({
                    status: 'OVERDUE',
                    page: 1,
                    per_page: 10,
                });
                setRequests([...response.data.requests, ...returningResponse.data.requests, ...overdueResponse.data.requests]);
            } else {
                setRequests(response.data.requests || []);
            }
        } catch (error) {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [currentTab]);

    const handleViewDetail = (request: BorrowRequest) => {
        setSelectedRequest(request);
        setShowDetailPage(true);
    };

    const handleBack = () => {
        setShowDetailPage(false);
        setSelectedRequest(null);
        fetchRequests();
    };

    const handleTabChange = (key: string) => {
        setCurrentTab(key);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleRequestUpdate = () => {
        fetchRequests('PENDING');
        fetchRequests('REJECTED');
    };

    if (showDetailPage && selectedRequest) {
        return <RequestDetail requestId={selectedRequest._id} onBack={handleBack} />;
    }

    const filteredRequests = filterRequestsBySearch(requests, searchText);

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                </div>
            );
        }

        if (!filteredRequests.length) {
            return (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#6b7280' }}>
                    Không có yêu cầu mượn nào
                </div>
            );
        }

        return (
            <Row gutter={[16, 16]}>
                {filteredRequests.map(request => (
                    <Col key={request._id} xs={24} sm={12} lg={8}>
                        <RequestCard
                            item={request}
                            onViewDetail={() => handleViewDetail(request)}
                            onRequestUpdate={handleRequestUpdate}
                        />
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: 24 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <h2 style={{ margin: 0 }}>Yêu cầu mượn của tôi</h2>
                        </Col>
                        <Col>
                            <Space>
                                <Input
                                    placeholder="Tìm kiếm theo tên thiết bị hoặc mã thiết bị"
                                    prefix={<SearchOutlined />}
                                    onChange={e => handleSearch(e.target.value)}
                                    style={{ width: 300 }}
                                />
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Tabs activeKey={currentTab} onChange={handleTabChange}>
                    <TabPane tab="Chờ duyệt" key="PENDING">
                        {renderContent()}
                    </TabPane>
                    <TabPane tab="Đã duyệt" key="APPROVED">
                        {renderContent()}
                    </TabPane>
                    <TabPane tab="Đã từ chối" key="REJECTED">
                        {renderContent()}
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default YeuCauMuon;