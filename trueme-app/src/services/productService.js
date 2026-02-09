import axiosInstance from '../api/axiosInstance';

// PREFIX for all product routes (Gateway routes /products/** -> Service, StripPrefix=1)
const BASE_URL = '/products/api/products';

// 1. Get All Products (with Pagination & Sort)
// params: page, size, sortBy, direction
export const getAllProducts = async (params = {}) => {
    try {
        const response = await axiosInstance.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// 2. Get Product by ID
export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

// 3. Search Products by Name
export const searchProductsByName = async (name) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/name`, { params: { name } });
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error);
        // Return empty list on error for search to be graceful
        return [];
    }
};

// 4. Filter Products
// params: productStatus, skinType, productType, minPrice, maxPrice, minPhValue, maxPhValue
export const filterProducts = async (filterParams = {}) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/filter`, { params: filterParams });
        return response.data;
    } catch (error) {
        console.error("Error filtering products:", error);
        throw error;
    }
};

// 5. Check if Product is Active (By Status)
// params: isActive (boolean)
export const getProductsByStatus = async (isActive) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/status`, { params: { isActive } });
        return response.data;
    } catch (error) {
        console.error("Error fetching status products:", error);
        throw error;
    }
};

// 6. Create Product (Seller/Admin)
export const createProduct = async (productData) => {
    try {
        // Determine content type (multipart if file is present, otherwise json)
        // Assuming JSON for now unless we see file upload logic
        const response = await axiosInstance.post(BASE_URL, productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

// 7. Update Product (Seller/Admin)
export const updateProduct = async (id, productData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error(`Error updating product ${id}:`, error);
        throw error;
    }
};

// 8. Delete Product (Seller/Admin)
export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting product ${id}:`, error);
        throw error;
    }
};

// 9. Activate Product (PATCH)
export const activateProduct = async (id) => {
    try {
        const response = await axiosInstance.patch(`${BASE_URL}/${id}/activate`);
        return response.data;
    } catch (error) {
        console.error(`Error activating product ${id}:`, error);
        throw error;
    }
};

// 10. Increase Stock (PUT)
export const increaseStock = async (id, quantity) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}/stock/increase`, { quantity });
        return response.data;
    } catch (error) {
        console.error(`Error increasing stock ${id}:`, error);
        throw error;
    }
};

// 11. Decrease Stock (PUT)
export const decreaseStock = async (id, quantity) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}/stock/decrease`, { quantity });
        return response.data;
    } catch (error) {
        console.error(`Error decreasing stock ${id}:`, error);
        throw error;
    }
};