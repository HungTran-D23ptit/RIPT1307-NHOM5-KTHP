import type { BorrowHistoryItem } from '@/services/User/BorrowRequest';
import { getBorrowHistory, reviewBorrowRequest } from '@/services/User/BorrowRequest';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export function useHistoryBorrowModel() {
	const [allRecords, setAllRecords] = useState<BorrowHistoryItem[]>([]);
	const [filteredRecords, setFilteredRecords] = useState<BorrowHistoryItem[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<BorrowHistoryItem | null>(null);
	const [note, setNote] = useState('');
	const [rating, setRating] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const [reviewCount, setReviewCount] = useState<number>(0);

	const [keyword, setKeyword] = useState('');
	const [filterTime, setFilterTime] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const res = await getBorrowHistory();
			const all = [
				...(res?.borrowing?.data || []),
				...(res?.returned?.data || []),
				...(res?.overdue?.data || []),
			];
			setAllRecords(all);
			setFilteredRecords(all);
			setReviewCount(res?.total_reviews || 0);
		} catch (error) {
			message.error('Lấy dữ liệu lịch sử mượn thất bại');
		}
	};

	const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');

	const handleFilterChange = (newKeyword = keyword, newTime = filterTime, newStatus = filterStatus) => {
		let filtered = allRecords;

		if (newKeyword.trim() !== '') {
			filtered = filtered.filter((item) => item.device.name.toLowerCase().includes(newKeyword.toLowerCase()));
		}

		if (newTime !== 'all') {
			const now = new Date();
			filtered = filtered.filter((item) => {
				const borrowDate = new Date(item.borrow_date);
				if (newTime === '7days') {
					const diff = (now.getTime() - borrowDate.getTime()) / (1000 * 3600 * 24);
					return diff <= 7;
				}
				if (newTime === 'thismonth') {
					return borrowDate.getMonth() === now.getMonth() && borrowDate.getFullYear() === now.getFullYear();
				}
				return true;
			});
		}

		if (newStatus !== 'all') {
			const statusMap: Record<string, string> = {
				approved: 'APPROVED',
				returned: 'RETURNED',
				overdue: 'OVERDUE',
			};
			filtered = filtered.filter((item) => item.status === statusMap[newStatus]);
		}

		setFilteredRecords(filtered);
		setKeyword(newKeyword);
		setFilterTime(newTime);
		setFilterStatus(newStatus);
	};

	const openReviewModal = (record: BorrowHistoryItem) => {
		setSelectedRecord(record);
		setNote(record.note || '');
		setRating(record.rating || 0);
		setIsModalVisible(true);
	};

	const handleReviewSubmit = async () => {
		if (!selectedRecord || rating === 0) {
			message.warning('Vui lòng chọn mức đánh giá.');
			return;
		}
		try {
			setLoading(true);
			await reviewBorrowRequest(selectedRecord._id, {
				rating,
				comment: note,
			});
			message.success('Đánh giá thành công!');
			setIsModalVisible(false);
			setRating(0);
			setNote('');
			await fetchData();
			handleFilterChange(keyword, filterTime, filterStatus);
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Gửi đánh giá thất bại!');
		} finally {
			setLoading(false);
		}
	};

	return {
		allRecords,
		filteredRecords,
		isModalVisible,
		selectedRecord,
		note,
		rating,
		loading,
		reviewCount,
		keyword,
		filterTime,
		filterStatus,
		formatDate,
		handleFilterChange,
		openReviewModal,
		handleReviewSubmit,
		setNote,
		setRating,
		setIsModalVisible,
	};
}
