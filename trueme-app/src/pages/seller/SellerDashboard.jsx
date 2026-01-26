import React, { useEffect, useState } from 'react';
import { getSellerOrders, updateOrderStatus } from '../../services/orderService';

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getSellerOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, currentStatus) => {
    let newStatus = '';
    
    // Logic: PLACED -> IN_TRANSIT -> COMPLETED
    if (currentStatus === 'PLACED') newStatus = 'IN_TRANSIT';
    else if (currentStatus === 'IN_TRANSIT') newStatus = 'COMPLETED';
    else return; // Already completed

    await updateOrderStatus(orderId, newStatus);
    
    // Update UI Optimistically
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    alert(`Order updated to ${newStatus}`);
  };

  if (loading) return <div className="p-10 text-center">Loading Seller Panel...</div>;

  return (
    <div className="p-4 lg:p-10">
      <h1 className="text-3xl font-bold mb-6">📦 Seller Dashboard</h1>
      
      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg border border-gray-200">
        <table className="table">
          {/* Table Head */}
          <thead className="bg-base-200">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Current Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-bold">{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>
                  {order.items.map((i, idx) => (
                    <div key={idx} className="text-xs">{i.qty}x {i.name}</div>
                  ))}
                </td>
                <td>
                  <span className="badge badge-success text-white badge-sm">{order.paymentStatus}</span>
                </td>
                <td>
                   <span className={`badge ${
                     order.status === 'COMPLETED' ? 'badge-primary' : 
                     order.status === 'IN_TRANSIT' ? 'badge-warning' : 'badge-ghost'
                   }`}>
                     {order.status}
                   </span>
                </td>
                <td>
                  {/* Status Change Logic */}
                  {order.status === 'PLACED' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, order.status)}
                      className="btn btn-xs btn-outline btn-warning"
                    >
                      Ship Order 🚚
                    </button>
                  )}
                  {order.status === 'IN_TRANSIT' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, order.status)}
                      className="btn btn-xs btn-primary"
                    >
                      Mark Delivered ✅
                    </button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <span className="text-success text-xs font-bold">Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerDashboard;