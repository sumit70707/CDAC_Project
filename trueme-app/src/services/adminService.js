import axiosInstance from '../api/axiosInstance';

// 1. Get All Users (Admin)
export const getAllUsers = async () => {
  try {
    // Correct Path: /auth/admin/users
    const response = await axiosInstance.get('/auth/admin/users');
    return response.data;
  } catch (error) {
    console.error("Admin API Error:", error);
    // Return empty array to prevent crash
    return [];
  }
};

// 2. Toggle User Status (Suspend/Activate)
// Backend: DELETE /auth/admin/users/{id} with Body: DeleteUserRequestDto { status: 'ACTIVE' | 'SUSPENDED' }
// Note: Using DELETE with body is unusual but required by backend contract.
export const toggleUserStatus = async (userId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const response = await axiosInstance.delete(`/auth/admin/users/${userId}`, {
      data: { status: newStatus }
    });
    return response.data;
  } catch (error) {
    console.error("Status Change Error:", error);
    throw error;
  }
};

// 3. Delete User (Admin) - Effectively Suspend
export const deleteUser = async (userId) => {
  try {
    // Backend requires status. detailed delete might just be suspend.
    const response = await axiosInstance.delete(`/auth/admin/users/${userId}`, {
      data: { status: 'SUSPENDED' }
    });
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error;
  }
};

// 4. Toggle Premium Status (Admin)
// Backend: PUT /auth/admin/users/{id} with Body: UpdateUserRequestDto { isPremium: boolean }
export const togglePremiumStatus = async (userId, isPremium) => {
  try {
    const response = await axiosInstance.put(`/auth/admin/users/${userId}`, {
      isPremium: isPremium
    });
    return response.data;
  } catch (error) {
    console.error("Premium Toggle Error:", error);
    throw error;
  }
};