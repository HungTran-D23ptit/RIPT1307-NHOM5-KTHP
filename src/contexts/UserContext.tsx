import { getUserProfile } from '@/services/User/Profile';
import type { User } from '@/services/Admin/User/typing';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

// 👉 Tạo event đơn giản (bạn cũng có thể dùng mitt hoặc EventEmitter nếu muốn)
const listeners: ((user: User) => void)[] = [];

export const emitUserUpdated = (newUser: User) => {
	listeners.forEach((fn) => fn(newUser));
};

interface IUserContext {
	user: User | null;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const useUser = () => {
	const context = useContext(UserContext);

	if (!context) {
		console.error('⚠️ useUser được gọi ngoài phạm vi UserProvider.');
		console.trace(); // hiện stack trace để biết gọi từ đâu
		throw new Error('useUser must be used within a UserProvider');
	}

	return context.user;
};

export const useSetUser = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error('useSetUser must be used within a UserProvider');
	return context.setUser;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await getUserProfile();
				setUser(res.data?.data);
			} catch (err) {
				console.error('Lỗi khi fetch user profile:', err);
			}
		};

		fetchUser();

		// Đăng ký listener khi có cập nhật user từ nơi khác
		const handler = (newUser: User) => setUser(newUser);
		listeners.push(handler);

		return () => {
			const idx = listeners.indexOf(handler);
			if (idx !== -1) listeners.splice(idx, 1);
		};
	}, []);

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
