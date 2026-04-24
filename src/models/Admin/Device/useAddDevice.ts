import { createDevice } from '@/services/Admin/Device/device';
import { DeviceFormData, DeviceType } from '@/services/Admin/Device/typing';
import rootAPI from '@/services/rootAPI';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useAddDevice = (onSuccess: () => void) => {
	const [loading, setLoading] = useState(false);
	const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);

	useEffect(() => {
		let isMounted = true;

		const fetchDeviceTypes = async () => {
			try {
				const response = await rootAPI.get('/admin/device/types');

				if (response.data && response.data.data && isMounted) {
					const types = response.data.data.map((item: { type: string }) => ({
						label: item.type === 'Other' ? 'Khác' : item.type,
						value: item.type,
					}));

					setDeviceTypes(types);
				}
			} catch (error) {
				if (isMounted) {
					message.error('Không thể tải danh sách loại thiết bị');
				}
			}
		};

		fetchDeviceTypes();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleSubmit = async (values: DeviceFormData, fileList: any[]) => {
		try {
			setLoading(true);

			const validTypes = deviceTypes.map((dt) => dt.value);
			if (!validTypes.includes(values.type)) {
				message.error('Loại thiết bị không hợp lệ');
				return false;
			}

			const formData = new FormData();
			// Kiểm tra và thêm các trường bắt buộc
			if (values.name) formData.append('name', values.name);
			if (values.code) formData.append('code', values.code);
			if (values.type) formData.append('type', values.type);
			if (values.description) formData.append('description', values.description);
			if (values.quantity) formData.append('quantity', values.quantity.toString());
			formData.append('status', 'NORMAL');

			// Xử lý file
			if (fileList && fileList.length > 0) {
				const file = fileList[0];
				if (file.originFileObj) {
					console.log('Uploading new file:', file.originFileObj);
					const fileType = file.originFileObj.type.toLowerCase();
					const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
					if (!isJpgOrPng) {
						message.error('Chỉ chấp nhận file JPG/PNG!');
						return false;
					}
					formData.append('image', file.originFileObj, file.originFileObj.name);
				}
			}

			// Debug FormData
			console.log('FormData contents:');
			const formDataObj = Object.fromEntries(formData as any);
			Object.entries(formDataObj).forEach(([key, value]) => {
				console.log(`${key}:`, value);
			});

			const response = await createDevice(formData);
			console.log('Create response:', response);

			message.success('Thêm thiết bị mới thành công');
			onSuccess();
			return true;
		} catch (error: any) {
			console.error('Create error:', error);
			if (error.response?.data?.detail) {
				const errors = error.response.data.detail;
				Object.entries(errors).forEach(([field, msg]: [string, any]) => {
					const vietnameseMessages: { [key: string]: string } = {
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
				message.error('Không thể thêm thiết bị mới. Vui lòng thử lại sau');
			}
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		deviceTypes,
		handleSubmit,
	};
};
