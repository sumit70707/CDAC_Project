import axiosInstance from '../api/axiosInstance';

const BASE_URL = '/payments';

// 1. Create Payment
// POST /payments
// Request body: PaymentCreateRequestDto
export const createPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post(BASE_URL, paymentData);
        return response.data; // PaymentResponseDto
    } catch (error) {
        console.error("Error creating payment:", error);
        throw error;
    }
};

// 2. Update Payment Status
// PUT /payments/status
// Request body: PaymentStatusUpdateRequestDto
export const updatePaymentStatus = async (paymentId, status) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/status`, {
            paymentId,
            status
        });
        return response.data;
    } catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
    }
};

// 3. Payment Success Callback
// GET /payments/success
export const handlePaymentSuccess = async (sessionId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/success`, {
            params: { session_id: sessionId }
        });
        return response.data;
    } catch (error) {
        console.error("Error handling payment success:", error);
        throw error;
    }
};

// 4. Payment Cancel Callback
// GET /payments/cancel
export const handlePaymentCancel = async (sessionId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/cancel`, {
            params: { session_id: sessionId }
        });
        return response.data;
    } catch (error) {
        console.error("Error handling payment cancel:", error);
        throw error;
    }
};

// 5. Internal Checkout (Initiate Stripe Payment for Order)
// POST /internal/payments/checkout
// Request body: PaymentCheckoutRequestDto { orderId, amount, currency }
export const initiateCheckout = async (orderId) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/checkout`, {
            orderId
        });
        // Response: PaymentCheckoutResponseDto { checkoutUrl, sessionId }
        return response.data;
    } catch (error) {
        console.error("Error initiating checkout:", error);
        throw error;
    }
};

export default {
    createPayment,
    updatePaymentStatus,
    handlePaymentSuccess,
    handlePaymentCancel,
    initiateCheckout
};
