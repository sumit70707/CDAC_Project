import api from './api';

// --- MOCK DATA (Matches your Database Schema) ---
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Hydrating Rose Cleanser",
    description: "Gentle cleanser that preserves natural oils.",
    image_url: "https://images.unsplash.com/photo-1556228720-1987594a8b44?auto=format&fit=crop&w=600&q=80",
    price: 499.00,
    qty: 50,
    product_status: "AVAILABLE",
    skin_type: "Dry",       // Enum from your DB
    product_type: "Cleansers", // Enum from your DB
    product_ph_value: 5.5
  },
  {
    id: 2,
    name: "Vitamin C Glow Serum",
    description: "Brightens skin and reduces dark spots.",
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    price: 1299.00,
    qty: 20,
    product_status: "AVAILABLE",
    skin_type: "All",
    product_type: "Serums",
    product_ph_value: 4.0
  },
  {
    id: 3,
    name: "Oil Control Matte Gel",
    description: "Lightweight moisturizer for oily skin.",
    image_url: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=600&q=80",
    price: 850.00,
    qty: 0,
    product_status: "OUT_OF_STOCK",
    skin_type: "Oily",
    product_type: "Moisturizers",
    product_ph_value: 6.0
  },
  {
    id: 4,
    name: "Daily Sunscreen SPF 50",
    description: "No white cast, broad spectrum protection.",
    image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
    price: 699.00,
    qty: 100,
    product_status: "AVAILABLE",
    skin_type: "Sensitive",
    product_type: "Sunscreens",
    product_ph_value: 7.0
  }
];

const USE_MOCK = true; // Toggle this to FALSE when backend is ready

const mockResponse = (data, delay = 500) => 
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// Fetch all products
export const getAllProducts = async () => {
  if (USE_MOCK) {
    console.log("⚠️ MOCK FETCH PRODUCTS");
    return mockResponse(MOCK_PRODUCTS);
  }
  const response = await api.get('/products');
  return response.data;
};

// Fetch single product by ID (for details page later)
export const getProductById = async (id) => {
  if (USE_MOCK) {
    const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
    return mockResponse(product);
  }
  const response = await api.get(`/products/${id}`);
  return response.data;
};