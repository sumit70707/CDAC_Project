import axios from 'axios';

// UPDATED: Pointing to your Swagger Port 8081
const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;