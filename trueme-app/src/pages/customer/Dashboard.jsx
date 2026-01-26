import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMyOrders } from '../../services/orderService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* LEFT SIDEBAR: Profile Card */}
      <div className="lg:col-span-1">
        <div className="card bg-base-100 shadow-xl border border-gray-100">
          <div className="card-body items-center text-center">
            <div className="avatar placeholder mb-2">
              <div className="bg-neutral text-neutral-content rounded-full w-20">
                <span className="text-3xl">{user?.firstName?.charAt(0)}</span>
              </div>
            </div>
            <h2 className="card-title">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="badge badge-primary badge-outline mt-2">{user?.role}</div>
            
            <div className="divider"></div>
            <ul className="menu bg-base-100 w-full p-0 rounded-box">
              <li><a className="active">📦 My Orders</a></li>
              <li><a>❤️ Wishlist</a></li>
              <li><a>⚙️ Settings</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Order History */}
      <div className="lg:col-span-3">
        <h2 className="text-2xl font-bold mb-6">Order History</h2>
        
        {orders.length === 0 ? (
          <div className="alert">You have no orders yet. Go shop!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="card bg-base-100 shadow-md border border-gray-100">
                <div className="card-body p-6">
                  
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Order Placed</p>
                      <p className="font-medium">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                      <p className="font-medium">₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Order #</p>
                      <p className="font-medium">{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                       <span className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : 'badge-warning'} text-white`}>
                         {order.status}
                       </span>
                    </div>
                  </div>

                  <div className="divider my-0"></div>

                  {/* Order Items */}
                  <div className="flex gap-4 mt-4 overflow-x-auto">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 border p-2 rounded-lg pr-6">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-outline">View Invoice</button>
                    {order.status === 'DELIVERED' && (
                      <Link to="/shop" className="btn btn-sm btn-primary">Buy Again</Link>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;