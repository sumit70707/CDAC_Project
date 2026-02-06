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
// Backend: PUT /auth/admin/users/{id} (Body: UpdateUserRequestDto?) 
// OR DELETE /auth/admin/users/{id}? User list says DELETE is for delete.
// User list says: PUT /auth/admin/users/{id}.
// Let's assume PUT updates status.
export const toggleUserStatus = async (userId, currentStatus) => {
  try {
    // We send payload to update status. 
    // If backend expects specific DTO, we might need to check.
    // For now assuming we send { status: '...' }
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const response = await axiosInstance.put(`/auth/admin/users/${userId}`, {
      status: newStatus
    });
    return response.data;
  } catch (error) {
    console.error("Status Change Error:", error);
    throw error;
  }
};

// 3. Delete User (Admin)
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/auth/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error;
  }
};

// 4. Toggle Premium Status (Admin)
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