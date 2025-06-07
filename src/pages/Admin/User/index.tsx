import { useUserData } from '@/models/Admin/User/UserData';
import { useUserModal } from '@/models/Admin/User/UserModal';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import * as XLSX from 'xlsx';
import UserFilters from './components/UserFilters';
import UserModal from './components/UserModal';
import UserTable from './components/UserTable';

export default function UserManagement() {
	const { filteredData, loading, pagination, selectedStatus, setPagination, setSelectedStatus, fetchUsers, onSearch } =
		useUserData();

	const { modalVisible, selectedUser, editStatus, setEditStatus, handleEditClick, handleModalOk, handleModalCancel } =
		useUserModal(fetchUsers);

	const exportExcel = () => {
		// Chuyển đổi dữ liệu filteredData thành worksheet
		const worksheet = XLSX.utils.json_to_sheet(filteredData);
		// Tạo workbook và thêm worksheet vào
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
		// Xuất file Excel
		XLSX.writeFile(workbook, 'Danh_sach_nguoi_dung.xlsx');
	};

	return (
		<div style={{ padding: 24 }}>
			<Card bordered={false}>
				<Row justify='space-between' align='middle' style={{ marginBottom: 24 }}>
					<Col>
						<h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>Quản lý người dùng</h1>
						<span style={{ color: '#666' }}>Quản lý danh sách sinh viên và quản trị viên</span>
					</Col>
					<Col>
						<Button icon={<DownloadOutlined />} onClick={exportExcel}>
							Xuất danh sách
						</Button>
					</Col>
				</Row>

				<UserFilters
					searchValue=''
					selectedStatus={selectedStatus}
					onSearchChange={onSearch}
					onStatusChange={setSelectedStatus}
				/>

				<UserTable
					data={filteredData}
					loading={loading}
					pagination={pagination}
					onPaginationChange={(current, pageSize) => {
						setPagination({ current, pageSize, total: filteredData.length });
					}}
					onEditClick={handleEditClick}
				/>

				<UserModal
					visible={modalVisible}
					selectedUser={selectedUser}
					editStatus={editStatus}
					onOk={handleModalOk}
					onCancel={handleModalCancel}
					onStatusChange={setEditStatus}
				/>
			</Card>
		</div>
	);
}
