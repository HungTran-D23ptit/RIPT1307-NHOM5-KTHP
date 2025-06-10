import type { UserTableProps } from '@/services/Admin/User/frontendTyping';
import type { UserDataType } from '@/services/Admin/User/typing';
import { EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const UserTable: React.FC<UserTableProps> = ({ data, loading, pagination, onPaginationChange, onEditClick }) => {
	const columns: ColumnsType<UserDataType> = [
		{
			title: 'Họ tên',
			dataIndex: 'name',
			key: 'name',
			render: (_text: string, record: UserDataType) => (
				<Space>
					<Avatar src={record.avatar || undefined}>{!record.avatar && record.name?.[0]}</Avatar>
					<span>{record.name}</span>
				</Space>
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (email: string) => (
				<Tooltip title={email}>
					<span
						style={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: 'inline-block',
							maxWidth: 150,
						}}
					>
						{email}
					</span>
				</Tooltip>
			),
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gender',
			key: 'gender',
			render: (gender: string) => (gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác'),
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'dob',
			key: 'dob',
			render: (dob: string) => dayjs(dob).format('DD/MM/YYYY'),
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'address',
			key: 'address',
			render: (address: string) => (
				<Tooltip title={address}>
					<span>{address?.length > 30 ? `${address.slice(0, 30)}...` : address}</span>
				</Tooltip>
			),
		},
		{
			title: 'Khoa/Ngành',
			dataIndex: 'department',
			key: 'department',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
					{status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
				</Tag>
			),
		},
		{
			title: 'Hành động',
			key: 'action',
			fixed: 'right' as const,
			render: (_: any, record: UserDataType) => (
				<Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => onEditClick(record)} />
			),
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={data}
			scroll={{ x: 'max-content' }}
			loading={loading}
			pagination={{
				current: pagination.current,
				pageSize: pagination.pageSize,
				total: pagination.total,
				showSizeChanger: true,
				showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
				pageSizeOptions: ['10', '20', '50', '100'],
				onChange: onPaginationChange,
			}}
		/>
	);
};

export default UserTable;
