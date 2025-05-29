import { useEditDevice } from '@/models/Admin/Device/useEditDevice';
import { EditDeviceModalProps } from '@/services/Admin/Device/device';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, message, Modal, Select, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';

const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ visible, onCancel, onSuccess, initialData }) => {
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const { loading, deviceTypes, handleSubmit } = useEditDevice(initialData, onSuccess);

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
			if (initialData.image_url && initialData.image_url.trim() !== '') {
				setFileList([
					{
						uid: '-1',
						name: 'image.png',
						status: 'done',
						url: initialData.image_url,
					},
				]);
			} else {
				setFileList([]);
			}
		}
	}, [initialData, form]);

	const onSubmit = async () => {
		try {
			const values = await form.validateFields();
			await handleSubmit(values, fileList);
		} catch (error) {
			// Form validation errors are handled by antd
		}
	};

	const uploadProps: UploadProps = {
		beforeUpload: (file) => {
			const isImage = file.type.startsWith('image/');
			if (!isImage) {
				message.error('Chỉ có thể tải lên file ảnh!');
				return Upload.LIST_IGNORE;
			}
			const isLt5M = file.size / 1024 / 1024 < 5;
			if (!isLt5M) {
				message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
				return Upload.LIST_IGNORE;
			}
			return true;
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
		<Modal title='Cập nhật thiết bị' open={visible} onCancel={onCancel} onOk={onSubmit} confirmLoading={loading}>
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
