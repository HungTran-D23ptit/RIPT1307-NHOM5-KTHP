import { Row, Col, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { SearchHeaderProps } from '@/services/User/AllRequest/FEtyping';

const SearchHeader = ({ onSearch }: SearchHeaderProps) => {
    return (
        <div style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col>
                    <h1
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            margin: 0,
                            color: '#1f2937',
                        }}
                    >
                        Yêu cầu mượn thiết bị
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 400, marginTop: 4 }}>
                        Quản lý các yêu cầu mượn thiết bị của bạn
                    </p>
                </Col>
                <Col>
                    <Space size={12}>
                        <Input
                            placeholder="Tìm kiếm yêu cầu..."
                            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                            style={{
                                width: 300,
                                borderRadius: 8,
                                borderColor: '#d1d5db',
                                padding: '6px 12px',
                                fontSize: 14,
                            }}
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default SearchHeader;
