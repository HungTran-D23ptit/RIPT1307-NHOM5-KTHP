export interface DeviceResponse {
    _id: string;
    name: string;
    code: string;
    type: string;
    description: string;
    image_url: string;
    quantity: number;
    status: string;
    is_available: boolean;
    last_borrowed_at: string | null;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetDevicesResponse {
    total: number;
    page: number;
    per_page: number;
    data: DeviceResponse[];
}

export interface GetDevicesParams {
    page?: number;
    per_page?: number;
    search?: string;
    type?: string;
    status?: string;
} 