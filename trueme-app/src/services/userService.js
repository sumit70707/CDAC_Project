import axiosInstance from '../api/axiosInstance';

const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return user.id;
        } catch (e) {
            console.error("Error parsing user from localstorage", e);
        }
    }
    return null;
};

// 1. Get My Profile
export const getMyProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

// 2. Update My Profile
export const updateMyProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put('/auth/me', profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

// --- ADDRESS MANAGEMENT ---

// 3. Get My Address (Controller returns single address or null?)
// Controller method: getMyAddress(@RequestHeader("X-USER-ID") Long userId) -> AddressResponseDto
export const getMyAddress = async () => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found");

    try {
        const response = await axiosInstance.get('/user/address', {
            headers: { 'X-USER-ID': userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching address:", error);
        throw error;
    }
};

// 4. Add Address
export const addAddress = async (addressData) => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found");

    try {
        const response = await axiosInstance.post('/user/address', addressData, {
            headers: { 'X-USER-ID': userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding address:", error);
        throw error;
    }
};

// 5. Update Address
export const updateAddress = async (addressData) => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found");

    try {
        const response = await axiosInstance.put('/user/address', addressData, {
            headers: { 'X-USER-ID': userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
};

// 6. Delete Address
export const deleteAddress = async () => {
    const userId = getUserId();
    if (!userId) throw new Error("User ID not found");

    try {
        await axiosInstance.delete('/user/address', {
            headers: { 'X-USER-ID': userId }
        });
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
};

