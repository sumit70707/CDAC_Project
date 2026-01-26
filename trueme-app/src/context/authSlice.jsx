import { createSlice } from '@reduxjs/toolkit';

// Check if user was already logged in (from previous visit)
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  role: user?.role || 'GUEST', // HELPFUL: We can check if they are ADMIN or CUSTOMER later
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
      
      // Save to browser storage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = 'GUEST';
      state.isAuthenticated = false;
      
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;