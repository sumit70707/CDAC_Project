import axiosInstance from '../api/axiosInstance';

const USE_MOCK = false;

// 1. Get Wishlist (Fix: Unwrap the nested 'product' object)
export const getWishlist = async (userId) => {
  if (USE_MOCK) return [];

  // GET /products/api/wishlist/{userId} (Gateway /products -> ProductService /api/wishlist)
  const response = await axiosInstance.get(`/products/api/wishlist/${userId}`);

  // CRITICAL FIX: The backend wraps the data in a "product" field.
  // We extract it here so the UI receives a flat object.
  return response.data.map(item => ({
    ...item.product,       // Spread all product details (name, price, imageUrl)
    wishlistId: item.id    // Keep the wishlist ID in case we need to delete it
  }));
};

// 2. Add to Wishlist
export const addToWishlist = async (userId, productId) => {
  if (USE_MOCK) return;
  const response = await axiosInstance.post(`/products/api/wishlist/${userId}/${productId}`);
  return response.data;
};

// 3. Remove from Wishlist
export const removeFromWishlist = async (userId, productId) => {
  if (USE_MOCK) return;
  const response = await axiosInstance.delete(`/products/api/wishlist/${userId}/${productId}`);
  return response.data;
};