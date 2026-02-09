import axiosInstance from '../api/axiosInstance';

const BASE_URL = '/auth';

// 1. Send Email OTP
export const sendEmailOtp = async (email) => {
  // POST /auth/email/send-otp
  const response = await axiosInstance.post(`${BASE_URL}/email/send-otp`, { email });
  return response.data; // String message
};

// 2. Verify Email OTP
export const verifyEmailOtp = async (email, otp) => {
  // POST /auth/email/verify-otp
  const response = await axiosInstance.post(`${BASE_URL}/email/verify-otp`, { email, otp });
  return response.data; // String message
};

// 3. Register (Complete Registration)
export const registerUser = async (userData) => {
  // POST /auth/register
  // userData matches RegisterRequestDto: { firstName, lastName, email, password, role, ... }
  const response = await axiosInstance.post(`${BASE_URL}/register`, userData);
  return response.data; // AuthResponseDto { accessToken, user }
};

// 4. Login
export const loginUser = async (credentials) => {
  // POST /auth/login
  const response = await axiosInstance.post(`${BASE_URL}/login`, credentials);
  if (response.data && response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data; // AuthResponseDto
};

// 5. Logout
export const logoutUser = async () => {
  try {
    await axiosInstance.post(`${BASE_URL}/logout`);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// 6. Forgot Password
// 6. Forgot Password - Step 1: Send OTP
export const sendForgotPasswordOtp = async (email) => {
  // POST /auth/forgot-password/send-otp
  const response = await axiosInstance.post(`${BASE_URL}/forgot-password/send-otp`, { email });
  return response.data;
};

// 7. Forgot Password - Step 2: Reset Password (Verify OTP + New Password)
export const forgotPassword = async (email, otp, newPassword) => {
  // POST /auth/forgot-password/reset
  const response = await axiosInstance.post(`${BASE_URL}/forgot-password/reset`, {
    email,
    otp,
    newPassword
  });
  return response.data;
};
