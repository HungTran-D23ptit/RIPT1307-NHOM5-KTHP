import { updateDevice } from '@/services/Admin/Device/device';
import rootAPI from '@/services/rootAPI';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, message, Modal, Select, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';

interface EditDeviceModalProps {
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
	initialData: any;
}

const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ visible, onCancel, onSuccess, initialData }) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [deviceTypes, setDeviceTypes] = useState<{ label: string; value: string }[]>([]);

	useEffect(() => {
		if (initialData) {
			form.setFieldsValue({
				name: initialData.name,
				code: initialData.code,
				description: initialData.description,
				quantity: initialData.quantity,
				type: initialData.type,
				status: initialData.status,
			});
			if (initialData.image_url) {
				setFileList([
					{
						uid: '-1',
						name: 'image.png',
						status: 'done',
						url: initialData.image_url,
					},
				]);
			}
		}
	}, [initialData, form]);

	useEffect(() => {
		async function fetchDeviceTypes() {
			try {
				const response = await rootAPI.get('/admin/device/types');
				if (response.data && response.data.types) {
					const types = response.data.types.map((type: string) => ({
						label: type === 'Other' ? 'Khác' : type,
						value: type,
					}));
					setDeviceTypes(types);
				}
			} catch (error) {
				message.error('Không thể tải danh sách loại thiết bị');
			}
		}
		fetchDeviceTypes();
	}, []);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			const validStatuses = ['NORMAL', 'MAINTENANCE'];
			if (!validStatuses.includes(values.status)) {
				message.error('Trạng thái không hợp lệ');
				setLoading(false);
				return;
			}

			const validTypes = deviceTypes.map((dt) => dt.value);
			if (!validTypes.includes(values.type)) {
				message.error('Loại thiết bị không hợp lệ');
				setLoading(false);
				return;
			}

			const formData = new FormData();
			formData.append('name', values.name);
			formData.append('code', values.code);
			formData.append('type', values.type);
			formData.append('description', values.description || '');
			formData.append('quantity', values.quantity.toString());
			formData.append('status', values.status);

			if (fileList[0]?.originFileObj) {
				const file = fileList[0].originFileObj;
				const fileType = file.type.toLowerCase();
				const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
				if (!isJpgOrPng) {
					message.error('Chỉ chấp nhận file JPG/PNG!');
					setLoading(false);
					return;
				}
				formData.append('image', file, file.name);
			} else if (!fileList.length && initialData.image_url) {
				formData.append('image', 'remove');
			}

			await updateDevice(initialData._id, formData);
			message.success('Cập nhật thiết bị thành công');
			onSuccess();
		} catch (error: any) {
			if (error.response?.data?.detail) {
				const errors = error.response.data.detail;
				Object.entries(errors).forEach(([field, msg]: [string, any]) => {
					const vietnameseMessages: Record<string, string> = {
						'Ảnh thiết bị does not match any of the allowed types':
							'Định dạng ảnh không hợp lệ. Vui lòng sử dụng file ảnh (jpg, png, jpeg)',
						'Trạng thái không hợp lệ.': 'Trạng thái thiết bị không hợp lệ. Vui lòng chọn trạng thái khác.',
						'Loại thiết bị không hợp lệ.': 'Loại thiết bị không hợp lệ. Vui lòng chọn loại khác.',
					};
					message.error(vietnameseMessages[msg] || msg);
				});
			} else if (error.response?.data?.message) {
				message.error('Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin');
			} else {
				message.error('Không thể cập nhật thiết bị. Vui lòng thử lại sau');
			}
		} finally {
			setLoading(false);
		}
	};

	const uploadProps: UploadProps = {
		beforeUpload: (file) => {
			const isImage = file.type.startsWith('image/');
			if (!isImage) {
				message.error('Chỉ có thể tải lên file ảnh!');
				return false;
			}
			const isLt5M = file.size / 1024 / 1024 < 5;
			if (!isLt5M) {
				message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
				return false;
			}
			return false;
		},
		fileList,
		onChange: ({ fileList: newFileList }) => {
			setFileList(newFileList);
		},
		maxCount: 1,
	};

	const statusOptions = [
		{ label: 'Có sẵn', value: 'NORMAL' },
		{ label: 'Đang bảo trì', value: 'MAINTENANCE' },
	];

	return (
		<Modal title='Cập nhật thiết bị' open={visible} onCancel={onCancel} onOk={handleSubmit} confirmLoading={loading}>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='name'
					label='Tên thiết bị'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên thiết bị' },
						{ max: 100, message: 'Tên thiết bị không được vượt quá 100 ký tự' },
					]}
				>
					<Input placeholder='Nhập tên thiết bị' />
				</Form.Item>

				<Form.Item
					name='code'
					label='Mã thiết bị'
					rules={[
						{ required: true, message: 'Vui lòng nhập mã thiết bị' },
						{ max: 50, message: 'Mã thiết bị không được vượt quá 50 ký tự' },
					]}
				>
					<Input placeholder='Nhập mã thiết bị' />
				</Form.Item>

				<Form.Item
					name='type'
					label='Loại thiết bị'
					rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị' }]}
				>
					<Select options={deviceTypes} />
				</Form.Item>

				<Form.Item
					name='description'
					label='Mô tả'
					rules={[{ max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }]}
				>
					<Input.TextArea placeholder='Nhập mô tả thiết bị' rows={4} />
				</Form.Item>

				<Form.Item
					name='quantity'
					label='Số lượng'
					rules={[
						{ required: true, message: 'Vui lòng nhập số lượng' },
						{ type: 'number', min: 0, message: 'Số lượng không được âm' },
					]}
				>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
					<Select options={statusOptions} />
				</Form.Item>

				<Form.Item name='image' label='Hình ảnh'>
					<Upload {...uploadProps} listType='picture'>
						<div>
							<UploadOutlined /> Tải ảnh lên
						</div>
					</Upload>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default EditDeviceModal;
