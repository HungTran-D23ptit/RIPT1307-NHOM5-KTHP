import { getDeviceTypes, updateDevice } from '@/services/Admin/Device/device';
import { DeviceFormData, DeviceResponse, DeviceType } from '@/services/Admin/Device/typing';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useEditDevice = (initialData: DeviceResponse, onSuccess: () => void) => {
	const [loading, setLoading] = useState(false);
	const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);

	async function fetchDeviceTypes() {
		try {
			const response = await getDeviceTypes();
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

			// ⚠️ Tạo updateData và chỉ gửi code nếu người dùng đã sửa
			const updateData: any = {
				status: values.status,
				type: values.type,
				name: values.name,
				description: values.description,
				quantity: values.quantity,
			};

			if (values.code !== initialData.code) {
				updateData.code = values.code;
			}

			// Xử lý hình ảnh
			if (fileList[0]?.originFileObj) {
				const file = fileList[0].originFileObj;
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
				if (!isJpgOrPng) {
					message.error('Chỉ chấp nhận file JPG/PNG!');
					return false;
				}
				updateData.image_url = file;
			} else if (!fileList.length && initialData.image_url) {
				updateData.image = 'remove';
			}

			console.log('Sending update data:', updateData);
			await updateDevice(initialData._id, updateData);
			message.success('Cập nhật thiết bị thành công');
			onSuccess();
			return true;
		} catch (error: any) {
			console.error('Update error:', error);
			if (error.response?.data?.detail) {
				const errors = error.response.data.detail;
				Object.entries(errors).forEach(([field, msg]: [string, any]) => {
					const vietnameseMessages: { [key: string]: string } = {
						'Ảnh thiết bị does not match any of the allowed types':
						'Định dạng ảnh không hợp lệ. Vui lòng sử dụng file ảnh (jpg, png, jpeg)',
						'Trạng thái không hợp lệ.': 'Trạng thái thiết bị không hợp lệ. Vui lòng chọn trạng thái khác.',
						'Loại thiết bị không hợp lệ.': 'Loại thiết bị không hợp lệ. Vui lòng chọn loại khác.',
						'Mã thiết bị đã tồn tại.': 'Mã thiết bị đã tồn tại. Vui lòng chọn mã khác.',
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
