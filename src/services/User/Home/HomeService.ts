import rootAPI from '../../rootAPI';
import type { BorrowingStats, CurrentBorrowing, ImportantReminder, RecommendedDevice } from './typing';

class HomeService {
  // Lấy thống kê tổng quan
  async getBorrowingStats(): Promise<BorrowingStats> {
    const response = await rootAPI.get('/user/borrow-requests/stats');
    const data = response.data?.data || response.data || {};
    return {
      totalBorrowed: (data.APPROVED || 0) + (data.RETURNING || 0),
      totalReturned: data.RETURNED || 0,
      pendingApproval: data.PENDING || 0,
      overdue: data.OVERDUE || 0
    };
  }

  // Lấy danh sách thiết bị đang mượn (2 thiết bị gần hạn nhất)
  async getCurrentBorrowings(): Promise<CurrentBorrowing[]> {
    const response = await rootAPI.get('/user/borrow-requests/borrowing');
    const responseData = response.data?.data || response.data || {};
    const borrowings = responseData.borrowings || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sắp xếp theo ngày trả gần nhất
    const sortedBorrowings = [...borrowings]
      .sort((a: any, b: any) => new Date(a.return_date).getTime() - new Date(b.return_date).getTime())
      .slice(0, 2);

    return sortedBorrowings.map((item: any) => {
      const returnDate = new Date(item.return_date);
      returnDate.setHours(0, 0, 0, 0);
      
      const diffTime = returnDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let returnStatus = '';
      if (diffDays < 0) {
        returnStatus = `Bạn đã quá hạn ${Math.abs(diffDays)} ngày`;
      } else if (diffDays === 0) {
        returnStatus = 'Hôm nay phải trả';
      } else {
        returnStatus = `Còn ${diffDays} ngày phải trả`;
      }

      return {
        _id: item._id,
        device: {
          _id: item.device?._id || '',
          name: item.device?.name || 'Thiết bị không tồn tại',
          code: item.device?.code || 'N/A',
          type: item.device?.type || 'N/A',
          image_url: item.device?.image_url
        },
        user: item.user,
        status: item.status,
        quantity: item.quantity,
        reason: item.reason,
        note: item.note,
        borrow_date: item.borrow_date,
        return_date: item.return_date,
        created_at: item.createdAt,
        returnStatus,
        daysRemaining: diffDays
      };
    });
  }

  // Lấy nhắc nhở quan trọng cho ngày hiện tại
  async getImportantReminders(): Promise<ImportantReminder[]> {
    const response = await rootAPI.get('/user/borrow-requests/borrowing');
    const responseData = response.data?.data || response.data || {};
    const borrowings = responseData.borrowings || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return borrowings
      .filter((item: any) => {
        if (!item.return_date) return false;
        const returnDate = new Date(item.return_date);
        returnDate.setHours(0, 0, 0, 0);
        return returnDate.getTime() === today.getTime();
      })
      .map((item: any) => ({
        deviceName: item.device?.name || 'Thiết bị không tồn tại',
        returnDate: item.return_date
      }));
  }

  // Lấy danh sách thiết bị đề xuất
  async getRecommendedDevices(): Promise<RecommendedDevice[]> {
    const response = await rootAPI.get('/user/device/recommendations/me');
    const responseData = response.data?.data || response.data || [];
    return responseData.map((item: any) => ({
      id: item._id,
      name: item.name || 'Thiết bị không tồn tại',
      code: item.code || 'N/A',
      type: item.type || 'N/A',
      description: item.description,
      imageUrl: item.image_url,
      quantity: item.quantity || 0
    }));
  }
}

export default new HomeService();