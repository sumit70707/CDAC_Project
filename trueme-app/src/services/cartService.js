import axiosInstance from '../api/axiosInstance';

const BASE_URL = '/api/cart';

// 1. Get Cart Items
export const getCartItems = async () => {
    try {
        const response = await axiosInstance.get(BASE_URL);
        return response.data; // List<CartItemResponseDto>
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

// 2. Add Item to Cart
export const addItemToCart = async (productId, quantity = 1) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/items`, {
            productId,
            quantity
        });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

// 3. Update Item Quantity
export const updateCartItemQuantity = async (productId, quantity) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/items/${productId}`, {
            quantity
        });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
    }
};

// 4. Remove Item from Cart
export const removeItemFromCart = async (productId) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/items/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};
