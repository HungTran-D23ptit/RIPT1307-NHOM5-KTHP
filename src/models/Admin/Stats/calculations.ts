import { BorrowStats, MostBorrowedDevice } from '@/services/Admin/Stats';

export const calculateTrendAndUsageRate = (data: MostBorrowedDevice[] | null | undefined) => {
	if (!Array.isArray(data)) {
		return [];
	}
	return data.map((item) => ({
		...item,
		usageRate: Math.random() * 100, // Mock usage rate
		trend: Math.random() * 20 - 10, // Mock trend between -10 and 10
	}));
};

export const calculateBorrowStats = (borrowStats: BorrowStats | null) => {
	const totalBorrowed =
		(borrowStats?.APPROVED || 0) +
		(borrowStats?.RETURNED || 0) +
		(borrowStats?.RETURNING || 0) +
		(borrowStats?.OVERDUE || 0);

	const totalReturnedAndOverdue = (borrowStats?.RETURNED || 0) + (borrowStats?.OVERDUE || 0);
	const onTimeReturnRate =
		totalReturnedAndOverdue > 0 ? ((borrowStats?.RETURNED || 0) / totalReturnedAndOverdue) * 100 : 0;

	return {
		totalBorrowed,
		onTimeReturnRate,
	};
};
