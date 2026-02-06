import axios from 'axios';

// IMPORTANT: Do NOT import store here as it creates a circular dependency
// store.js -> cartSlice.js -> axiosInstance.js -> store.js (ERROR)

// API Gateway URL (Proxy handled by Vite in dev)
const API_BASE_URL = ''; // Relative path so it goes through window.location.origin -> Vite Proxy

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        // Read token directly from localStorage to avoid importing store
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized (Token expired or invalid)
        if (error.response && error.response.status === 401) {
            // Instead of dispatching logout (which needs store), 
            // we clear storage and redirect. The App will react to missing token.
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Optional: Force reload to clear memory state if needed
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
