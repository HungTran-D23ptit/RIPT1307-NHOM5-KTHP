import { useState } from 'react';

export const useRejectModal = (onSuccess?: () => void) => {
	const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [currentRejectRequestId, setCurrentRejectRequestId] = useState<string | null>(null);

	const showRejectModal = (id: string) => {
		setCurrentRejectRequestId(id);
		setIsRejectModalVisible(true);
	};

	const hideRejectModal = () => {
		setIsRejectModalVisible(false);
		setRejectReason('');
		setCurrentRejectRequestId(null);
		if (onSuccess) {
			onSuccess();
		}
	};

	return {
		isRejectModalVisible,
		rejectReason,
		setRejectReason,
		currentRejectRequestId,
		showRejectModal,
		hideRejectModal,
	};
};
