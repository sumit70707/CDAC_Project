import axiosInstance from '../api/axiosInstance';

const BASE_URL = '/api/seller/orders';

// 1. Get Seller Orders (Paginated + Filter)
export const getSellerOrders = async (status = null, page = 0, size = 10) => {
    try {
        const params = { page, size };
        if (status) params.status = status;

        const response = await axiosInstance.get(BASE_URL, { params });
        // Backend returns Page<SellerOrderItemResponseDto> directly
        return response.data;
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        throw error;
    }
};

// 2. Update Order Item Status
// Backend: PUT /api/seller/orders/{orderItemId}/status?status=...
export const updateOrderItemStatus = async (orderItemId, newStatus) => {
    try {
        // Note: status is a RequestParam, not a Body
        const response = await axiosInstance.put(
            `${BASE_URL}/${orderItemId}/status`,
            null, // No body
            {
                params: { status: newStatus }
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating status for ${orderItemId}:`, error);
        throw error;
    }
};

// 3. Get Seller Dashboard Summary
export const getSellerSummary = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/summary`);
        return response.data;
    } catch (error) {
        console.error("Error fetching seller summary:", error);
        throw error;
    }
};
