import { message } from 'antd';
import { FormInstance } from 'antd/lib/form';

/**
 * Xử lý sự kiện upload avatar
 */
export const handleAvatarUpload = (
    info: any,
    setNewAvatarPreview: (preview: string | null) => void,
    setNewAvatarFile: (file: File | null) => void
) => {
    if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
        setNewAvatarPreview(e.target.result as string);
    };
    reader.readAsDataURL(info.file.originFileObj as File);

    setNewAvatarFile(info.file.originFileObj as File);
};

/**
 * Xử lý xóa avatar
 */
export const handleRemoveAvatar = (
    userData: any,
    setUserData: (data: any) => void,
    setNewAvatarFile: (file: File | null) => void,
    setNewAvatarPreview: (preview: string | null) => void,
    form: FormInstance
) => {
    setUserData({...userData, avatar: ''});
    setNewAvatarFile(null);
    setNewAvatarPreview(null);
    form.setFieldsValue({ avatar: '' });
};

/**
 * Kiểm tra điều kiện hiển thị nút upload
 */
export const shouldShowUploadButton = (newAvatarFile: File | null, userData: any) => {
    return !(newAvatarFile || userData?.avatar);
};

/**
 * Kiểm tra điều kiện hiển thị nút xóa avatar
 */
export const shouldShowRemoveButton = (userData: any, newAvatarFile: File | null) => {
    return userData?.avatar && !newAvatarFile;
};

/**
 * Xử lý submit form
 */
export const handleFormSubmit = async (
    values: any,
    newAvatarFile: File | null,
    userData: any,
    form: FormInstance,
    setLoading: (loading: boolean) => void,
    setUserData: (data: any) => void,
    setNewAvatarFile: (file: File | null) => void,
    setNewAvatarPreview: (preview: string | null) => void,
    prepareProfileFormData: (values: any, newAvatarFile: File | null, userData: any, form: FormInstance) => FormData,
    updateUserProfileWithFormData: (formData: FormData) => Promise<any>,
    fetchUserProfileAndFormat: (form: FormInstance, setUserData: (data: any) => void, setLoading: (loading: boolean) => void) => Promise<void>
) => {
    setLoading(true);
    try {
        const formData = prepareProfileFormData(values, newAvatarFile, userData, form);
        const response = await updateUserProfileWithFormData(formData);
        if (response.data && response.data.data && response.data.data.user) {
            message.success(response.data.data.message || 'Cập nhật thông tin thành công!');
            setUserData?.(response.data.data.user);
            setNewAvatarFile(null);
            setNewAvatarPreview(null);
            await fetchUserProfileAndFormat(form, setUserData, setLoading);
        }
    } catch (error: any) {
        message.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin.');
        console.error(error);
    } finally {
        setLoading(false);
    }
}; 