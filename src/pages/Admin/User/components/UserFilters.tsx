import type { UserFiltersProps } from '@/services/Admin/User/frontendTyping';
import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Select } from 'antd';

const UserFilters: React.FC<UserFiltersProps> = ({ searchValue, selectedStatus, onSearchChange, onStatusChange }) => {
	return (
		<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
			<Col xs={24} sm={16} md={18}>
				<Input
					placeholder='Tìm kiếm người dùng...'
					prefix={<SearchOutlined style={{ color: '#999' }} />}
					value={searchValue}
					onChange={(e) => onSearchChange(e.target.value)}
					allowClear
				/>
			</Col>
			<Col xs={24} sm={8} md={6}>
				<Select
					value={selectedStatus}
					onChange={onStatusChange}
					style={{ width: '100%' }}
					options={[
						{ value: 'all', label: 'Tất cả trạng thái' },
						{ value: 'ACTIVE', label: 'Đang hoạt động' },
						{ value: 'DE_ACTIVE', label: 'Ngưng hoạt động' },
					]}
				/>
			</Col>
		</Row>
	);
};

export default UserFilters;
