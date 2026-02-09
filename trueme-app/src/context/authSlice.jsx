import { createSlice } from '@reduxjs/toolkit';

// Helper to safely parse user from localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

const token = localStorage.getItem('token');
const user = getUserFromStorage();

const initialState = {
  user: user || null,
  token: token || null, 
  isAuthenticated: !!token,
  role: user?.role || 'GUEST',
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
      state.error = null;

      // Persist to storage
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = 'GUEST';
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, registerSuccess, logout, clearError } = authSlice.actions;
export default authSlice.reducer;