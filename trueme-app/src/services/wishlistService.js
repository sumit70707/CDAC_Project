import api from './api';

const USE_MOCK = true;
const mockResponse = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 500));

// Mock Wishlist Data
let mockWishlist = [];

// 1. Get Wishlist
export const getWishlist = async () => {
  if (USE_MOCK) return mockResponse(mockWishlist);
  const response = await api.get('/wishlist');
  return response.data;
};

// 2. Add to Wishlist
export const addToWishlist = async (product) => {
  if (USE_MOCK) {
    if (!mockWishlist.find(item => item.id === product.id)) {
      mockWishlist.push(product);
    }
    return mockResponse({ success: true });
  }
  const response = await api.post('/wishlist/add', { productId: product.id });
  return response.data;
};

// 3. Remove from Wishlist
export const removeFromWishlist = async (productId) => {
  if (USE_MOCK) {
    mockWishlist = mockWishlist.filter(item => item.id !== productId);
    return mockResponse({ success: true });
  }
  const response = await api.delete(`/wishlist/remove/${productId}`);
  return response.data;
};