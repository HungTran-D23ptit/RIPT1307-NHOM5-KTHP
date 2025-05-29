import { updateDevice } from '@/services/Admin/Device/device';
import { DeviceFormData, DeviceResponse, DeviceType } from '@/services/Admin/Device/typing';
import rootAPI from '@/services/rootAPI';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useEditDevice = (initialData: DeviceResponse, onSuccess: () => void) => {
	const [loading, setLoading] = useState(false);
	const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);

	// ✅ Đặt function declaration lên trước
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

	useEffect(() => {
		fetchDeviceTypes();
	}, []);

	const handleSubmit = async (values: DeviceFormData, fileList: any[]) => {
		try {
			setLoading(true);

			const validStatuses = ['NORMAL', 'MAINTENANCE'];
			if (!validStatuses.includes(values.status || '')) {
				message.error('Trạng thái không hợp lệ');
				return false;
			}

			const validTypes = deviceTypes.map((dt) => dt.value);
			if (!validTypes.includes(values.type)) {
				message.error('Loại thiết bị không hợp lệ');
				return false;
			}

			const formData = new FormData();
			formData.append('status', values.status || 'NORMAL');
			formData.append('type', values.type);
			formData.append('name', values.name);
			formData.append('code', values.code);
			if (values.description) {
				formData.append('description', values.description);
			}
			formData.append('quantity', values.quantity.toString());

			if (fileList[0]?.originFileObj) {
				formData.append('image_url', fileList[0].originFileObj);
			} else if (!fileList.length && initialData.image_url) {
				formData.append('image', 'remove');
			}

			await updateDevice(initialData._id, formData);
			message.success('Cập nhật thiết bị thành công');
			onSuccess();
			return true;
		} catch (error: any) {
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
				message.error('Không thể cập nhật thiết bị. Vui lòng thử lại sau');
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
