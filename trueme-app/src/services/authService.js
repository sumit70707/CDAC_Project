import api from './api';

// --- MOCK MODE: Set to TRUE while backend is offline ---
const USE_MOCK = true;

const mockResponse = (data, delay = 1000) => 
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// 1. Register
export const registerUser = async (userData) => {
  if (USE_MOCK) {
    console.log("⚠️ MOCK REGISTER CALL:", userData);
    return mockResponse({ message: "User registered successfully!" });
  }
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// 2. Login
export const loginUser = async (credentials) => {
  if (USE_MOCK) {
    console.log("⚠️ MOCK LOGIN CALL:", credentials);
    // Simulate a JWT Token and User Data response
    return mockResponse({
      token: "fake-jwt-token-xyz-123",
      user: {
        id: 1,
        email: credentials.email,
        firstName: "Test",
        lastName: "User",
        role: "CUSTOMER" // Change to 'ADMIN' or 'SELLER' to test those views later
      }
    });
  }
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// 3. Forgot Password (MOCK + REAL)
export const forgotPassword = async (email) => {
  if (USE_MOCK) {
    console.log("⚠️ MOCK FORGOT PASSWORD for:", email);
    // Simulate network delay
    return mockResponse({ 
      success: true, 
      message: "Password reset link sent to your email." 
    });
  }
  
  // Real Backend Call (Matches your Partner's SMTP Logic)
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};