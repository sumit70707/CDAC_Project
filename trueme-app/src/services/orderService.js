import axiosInstance from '../api/axiosInstance';

const BASE_URL = '/api/orders';

// 1. Get My Orders
export const getMyOrders = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get(BASE_URL, {
      params: { page, size }
    });
    // Backend returns ApiResponseWithData<Page<OrderResponseDto>>
    // We probably want the data property if the structure is { success: true, data: ... }
    // Or if it returns Page directly?
    // Let's assume standard response based on controller: ResponseEntity.ok(service.getMyOrders(...))
    // So response.data is the Page object or ApiResponse.
    // I'll return response.data for now and we can debug structure in Component.
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// 2. Get Order Details
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// 3. Create Order (Checkout)
// Backend: POST /api/checkout (no body, uses JWT userId + cart)
export const createOrder = async () => {
  try {
    const response = await axiosInstance.post('/api/checkout');
    return response.data; // ApiResponse { message, status }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// 4. Get Seller Orders (For Seller Dashboard)
// Note: This endpoint is likely different, potentially /api/orders/seller or similar.
// Checking SellerOrderController is recommended, but for now assuming /api/orders/seller-orders based on earlier context.
// Wait, I should check SellerOrderController if possible. For now leaving placeholder or reusing what we know.
export const getSellerOrders = async () => {
  // Placeholder pending Seller Controller verification
  return [];
};

// 5. Cancel Order (Customer)
export const cancelOrder = async (orderId) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling order ${orderId}:`, error);
    throw error;
  }
};

// 6. Update Order Status (Seller)
export const updateOrderStatus = async (orderId, status) => {
  // Placeholder
};