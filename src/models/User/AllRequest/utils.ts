import type { BorrowRequest } from '../../../services/User/AllRequest/FEtyping';

export const filterRequestsBySearch = (
    requests: BorrowRequest[],
    searchText: string
): BorrowRequest[] => {
    if (!searchText) return requests;
    
    return requests.filter(request =>
        request.device.name.toLowerCase().includes(searchText.toLowerCase()) ||
        request.device.code.toLowerCase().includes(searchText.toLowerCase())
    );
}; 