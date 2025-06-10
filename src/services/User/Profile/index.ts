import rootAPI from '../../rootAPI';
import moment from 'moment';

export async function getUserProfile() {
  return rootAPI.get('/user/profile');
}

export async function updateUserProfile(data: any) {
  return rootAPI.put('/user/profile', data);
}

/**
 * Chuẩn bị FormData từ dữ liệu form và file avatar mới (nếu có)
 */
export function prepareProfileFormData(values: any, newAvatarFile: File | null, userData: any, form: any) {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
        if (key === 'dob') {
            formData.append(key, values[key] ? values[key].toISOString() : '');
        } else if (key !== 'avatar') {
            formData.append(key, values[key] === undefined || values[key] === null ? '' : String(values[key]));
        }
    });
    if (newAvatarFile) {
        formData.append('avatar', newAvatarFile);
    } else if (userData?.avatar && form?.getFieldValue('avatar') === '') {
        formData.append('avatar', 'remove');
    }
    return formData;
}

/**
 * Gọi API cập nhật profile với FormData
 */
export async function updateUserProfileWithFormData(formData: FormData) {
    return rootAPI.put('/user/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * Hàm fetch profile trả về data chuẩn hóa
 */
export async function fetchUserProfileAndFormat(form: any, setUserData: (data: any) => void, setLoading: (b: boolean) => void) {
    setLoading(true);
    try {
        const response = await getUserProfile();
        if (response.data && response.data.data) {
            setUserData(response.data.data);
            form.setFieldsValue({
                name: response.data.data.name,
                email: response.data.data.email,
                phone: response.data.data.phone,
                gender: response.data.data.gender,
                dob: response.data.data.dob ? moment(response.data.data.dob) : null,
                address: response.data.data.address,
                department: response.data.data.department,
            });
        }
    } finally {
        setLoading(false);
    }
} 