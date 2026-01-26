import api from './api';

const USE_MOCK = true;

const mockResponse = (data, delay = 1000) => 
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const createOrder = async (orderData) => {
  if (USE_MOCK) {
    console.log("⚠️ MOCK CREATE ORDER:", orderData);
    return mockResponse({
      success: true,
      orderId: "ORD-" + Math.floor(Math.random() * 100000), // Fake Order ID
      status: "PLACED",
      message: "Order placed successfully!"
    });
  }
  
  
  // Real Backend Call (Future)
  const response = await api.post('/orders', orderData);
  return response.data;
};

// ... existing imports and createOrder function

// MOCK: Fetch Order History
export const getMyOrders = async () => {
  if (USE_MOCK) {
    console.log("⚠️ MOCK FETCH ORDERS");
    return mockResponse([
      {
        id: 101,
        orderNumber: "ORD-20260120-8854",
        date: "2026-01-20",
        totalAmount: 1299.00,
        status: "DELIVERED",
        items: [
          { name: "Vitamin C Glow Serum", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=100", qty: 1 }
        ]
      },
      {
        id: 102,
        orderNumber: "ORD-20260122-4421",
        date: "2026-01-22",
        totalAmount: 499.00,
        status: "IN_TRANSIT",
        items: [
          { name: "Hydrating Rose Cleanser", image: "https://images.unsplash.com/photo-1556228720-1987594a8b44?auto=format&fit=crop&w=100", qty: 1 }
        ]
      }
    ]);
  }
  
  // Real Backend Call
  const response = await api.get('/orders/my-orders');
  return response.data;
};



// ... existing imports

// MOCK SELLER ORDERS (Orders assigned to this seller)
export const getSellerOrders = async () => {
  if (USE_MOCK) {
    console.log("⚠️ MOCK FETCH SELLER ORDERS");
    return mockResponse([
      {
        id: 201,
        orderNumber: "ORD-9981",
        customerName: "Alice Customer",
        totalAmount: 1299.00,
        status: "PLACED", // Initial status
        paymentStatus: "PAID",
        items: [{ name: "Vitamin C Serum", qty: 1 }]
      },
      {
        id: 202,
        orderNumber: "ORD-7722",
        customerName: "John Doe",
        totalAmount: 499.00,
        status: "IN_TRANSIT",
        paymentStatus: "PAID",
        items: [{ name: "Rose Cleanser", qty: 1 }]
      }
    ]);
  }
  const response = await api.get('/orders/seller-orders');
  return response.data;
};

// UPDATE ORDER STATUS (Seller Action)
export const updateOrderStatus = async (orderId, newStatus) => {
  if (USE_MOCK) {
    console.log(`⚠️ MOCK UPDATE ORDER ${orderId} to ${newStatus}`);
    return mockResponse({ success: true });
  }
  const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
  return response.data;
};