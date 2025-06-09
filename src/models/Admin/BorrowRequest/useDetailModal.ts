import { useState } from 'react';

export const useDetailModal = (onSuccess?: () => void) => {
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [detailRequestId, setDetailRequestId] = useState<string | null>(null);

	const handleViewDetail = (id: string) => {
		setDetailRequestId(id);
		setShowDetailModal(true);
	};

	const handleCloseDetailModal = () => {
		setShowDetailModal(false);
		setDetailRequestId(null);
		if (onSuccess) {
			onSuccess();
		}
	};

	return {
		showDetailModal,
		detailRequestId,
		handleViewDetail,
		handleCloseDetailModal,
	};
};
