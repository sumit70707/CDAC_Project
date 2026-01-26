import api from './api';

const USE_MOCK = true;
const mockResponse = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 500));

// MOCK USER LIST
const MOCK_USERS = [
  { id: 1, name: "Alice Customer", email: "alice@test.com", role: "CUSTOMER", status: "ACTIVE", isPremium: false },
  { id: 2, name: "Bob Seller", email: "bob@seller.com", role: "SELLER", status: "ACTIVE", isPremium: false },
  { id: 3, name: "Charlie User", email: "charlie@test.com", role: "CUSTOMER", status: "SUSPENDED", isPremium: true },
  { id: 4, name: "Dave Admin", email: "admin@trueme.com", role: "ADMIN", status: "ACTIVE", isPremium: true },
];

export const getAllUsers = async () => {
  if (USE_MOCK) return mockResponse(MOCK_USERS);
  const response = await api.get('/admin/users');
  return response.data;
};

// Toggle User Status (Active/Suspended)
export const toggleUserStatus = async (userId, currentStatus) => {
  console.log(`Switching User ${userId} from ${currentStatus}`);
  return mockResponse({ success: true });
};