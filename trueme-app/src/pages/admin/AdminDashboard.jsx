import React, { useEffect, useState } from 'react';
import { getAllUsers, toggleUserStatus, deleteUser, togglePremiumStatus } from '../../services/adminService';
import { getAllProducts, activateProduct } from '../../services/productService';
import { getMyOrders } from '../../services/orderService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'products', 'orders'

  // User Management State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [filterRole, setFilterRole] = useState(null);

  // Product Oversight State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productFilter, setProductFilter] = useState('all'); // 'all', 'AVAILABLE', 'OUT_OF_STOCK'

  // Order Oversight State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setUsersLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setUsersLoading(false);
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await getAllProducts({ page: 0, size: 100 });
      // Response might be Page object with content array
      const productList = response.content || response;
      setProducts(productList);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      // Note: This should ideally be an admin-specific endpoint
      // For now using customer orders endpoint as placeholder
      const response = await getMyOrders(0, 50);
      const orderList = response.content || response.data || response;
      setOrders(orderList);
    } catch (error) {
      console.error("Failed to load orders", error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'products' && products.length === 0) {
      loadProducts();
    } else if (activeTab === 'orders' && orders.length === 0) {
      loadOrders();
    }
  }, [activeTab]);

  // ---  USER MANAGEMENT HANDLERS ---
  const handleStatusChange = async (id, currentStatus) => {
    try {
      await toggleUserStatus(id, currentStatus);
      setUsers(users.map(u => u.id === id ? { ...u, status: currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted successfully");
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const handleTogglePremium = async (id, currentPremium) => {
    try {
      await togglePremiumStatus(id, !currentPremium);
      setUsers(users.map(u => u.id === id ? { ...u, isPremium: !currentPremium } : u));
    } catch (error) {
      alert("Failed to toggle premium status");
    }
  };

  // --- PRODUCT OVERSIGHT HANDLERS ---
  const handleActivateProduct = async (id) => {
    try {
      await activateProduct(id);
      setProducts(products.map(p => p.id === id ? { ...p, productStatus: 'AVAILABLE' } : p));
    } catch (error) {
      alert("Failed to activate product");
    }
  };

  // --- FILTERED DATA ---
  const filteredUsers = filterRole ? users.filter(u => u.role === filterRole) : users;
  const filteredProducts = productFilter === 'all' ? products : products.filter(p => p.productStatus === productFilter);

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Header */}
      <div className="mb-12 border-b border-black pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">Platform Management & Oversight</p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-6 mb-12 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'users' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
        >
          👥 User Management
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'products' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
        >
          📦 Product Oversight
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
        >
          📊 Order Oversight
        </button>
      </div>

      {/* TAB CONTENT: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Total Users</p>
              <p className="text-4xl font-black">{users.length}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Customers</p>
              <p className="text-4xl font-black">{users.filter(u => u.role === 'CUSTOMER').length}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Sellers</p>
              <p className="text-4xl font-black">{users.filter(u => u.role === 'SELLER').length}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Active</p>
              <p className="text-4xl font-black">{users.filter(u => u.status === 'ACTIVE').length}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
            <button
              onClick={() => setFilterRole(null)}
              className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${!filterRole ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              All Users
            </button>
            <button
              onClick={() => setFilterRole('CUSTOMER')}
              className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${filterRole === 'CUSTOMER' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Customers
            </button>
            <button
              onClick={() => setFilterRole('SELLER')}
              className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${filterRole === 'SELLER' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              Sellers
            </button>
          </div>

          {/* User Table */}
          {usersLoading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full border-t border-black">
                <thead>
                  <tr className="border-b border-black text-black uppercase text-xs tracking-widest font-bold h-12">
                    <th className="rounded-none bg-gray-50">Name</th>
                    <th className="rounded-none bg-gray-50">Email</th>
                    <th className="rounded-none bg-gray-50">Role</th>
                    <th className="rounded-none bg-gray-50">Phone</th>
                    <th className="rounded-none bg-gray-50">Status</th>
                    <th className="rounded-none bg-gray-50">Premium</th>
                    <th className="rounded-none bg-gray-50 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-12 text-gray-400">No users found.</td></tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="font-bold">{user.firstName} {user.lastName}</td>
                      <td className="text-sm text-gray-600">{user.email}</td>
                      <td>
                        <span className={`badge rounded-none uppercase text-[10px] font-bold p-2 ${user.role === 'SELLER' ? 'badge-outline' : user.role === 'ADMIN' ? 'bg-purple-200' : 'bg-gray-200'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">{user.phone || 'N/A'}</td>
                      <td>
                        <span className={`badge rounded-none uppercase text-[10px] font-bold p-2 ${user.status === 'ACTIVE' ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        {user.role === 'CUSTOMER' && (
                          <button
                            onClick={() => handleTogglePremium(user.id, user.isPremium)}
                            className={`badge rounded-none uppercase text-[10px] font-bold p-2 cursor-pointer ${user.isPremium ? 'bg-yellow-400 text-black' : 'bg-gray-200'}`}
                          >
                            {user.isPremium ? '⭐ PREMIUM' : 'NORMAL'}
                          </button>
                        )}
                      </td>
                      <td className="text-right flex gap-2 justify-end">
                        <button
                          onClick={() => handleStatusChange(user.id, user.status)}
                          className={`btn btn-xs rounded-none uppercase text-[10px] ${user.status === 'ACTIVE' ? 'btn-outline btn-error' : 'btn-outline'}`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn btn-xs btn-error rounded-none uppercase text-[10px] text-white"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* TAB CONTENT: PRODUCT OVERSIGHT */}
      {activeTab === 'products' && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">All Platform Products</h2>
            <div className="flex gap-4">
              <button onClick={() => setProductFilter('all')} className={`btn btn-sm rounded-none ${productFilter === 'all' ? 'btn-neutral' : 'btn-outline'}`}>All</button>
              <button onClick={() => setProductFilter('AVAILABLE')} className={`btn btn-sm rounded-none ${productFilter === 'AVAILABLE' ? 'btn-neutral' : 'btn-outline'}`}>Available</button>
              <button onClick={() => setProductFilter('OUT_OF_STOCK')} className={`btn btn-sm rounded-none ${productFilter === 'OUT_OF_STOCK' ? 'btn-neutral' : 'btn-outline'}`}>Out of Stock</button>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full border-t border-black">
                <thead>
                  <tr className="border-b border-black text-black uppercase text-xs tracking-widest font-bold">
                    <th className="rounded-none bg-gray-50">Product</th>
                    <th className="rounded-none bg-gray-50">Price</th>
                    <th className="rounded-none bg-gray-50">Stock</th>
                    <th className="rounded-none bg-gray-50">Status</th>
                    <th className="rounded-none bg-gray-50">Type</th>
                    <th className="rounded-none bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-12 text-gray-400">No products found.</td></tr>
                  ) : filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="font-bold">{product.name}</td>
                      <td className="font-mono">₹{product.price}</td>
                      <td className="text-sm">{product.qty} units</td>
                      <td>
                        <span className={`badge rounded-none uppercase text-[10px] font-bold ${product.productStatus === 'AVAILABLE' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                          {product.productStatus}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">{product.productType}</td>
                      <td>
                        {product.productStatus !== 'AVAILABLE' && (
                          <button
                            onClick={() => handleActivateProduct(product.id)}
                            className="btn btn-xs btn-success rounded-none text-white"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* TAB CONTENT: ORDER OVERSIGHT */}
      {activeTab === 'orders' && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Platform Orders</h2>
            <p className="text-sm text-gray-500">View all orders across the platform for monitoring and analytics.</p>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full border-t border-black">
                <thead>
                  <tr className="border-b border-black text-black uppercase text-xs tracking-widest font-bold">
                    <th className="rounded-none bg-gray-50">Order #</th>
                    <th className="rounded-none bg-gray-50">Customer</th>
                    <th className="rounded-none bg-gray-50">Total</th>
                    <th className="rounded-none bg-gray-50">Status</th>
                    <th className="rounded-none bg-gray-50">Payment</th>
                    <th className="rounded-none bg-gray-50">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-12 text-gray-400">No orders found.</td></tr>
                  ) : orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="font-mono font-bold text-sm">{order.orderNumber || `ORD-${order.id}`}</td>
                      <td className="text-sm">Customer #{order.customer_id || order.customerId}</td>
                      <td className="font-mono">₹{order.totalAmount || order.total}</td>
                      <td>
                        <span className={`badge rounded-none uppercase text-[10px] font-bold ${order.status === 'COMPLETED' ? 'bg-green-600 text-white' : 'badge-outline'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge rounded-none uppercase text-[10px] ${order.paymentStatus === 'PAID' ? 'bg-black text-white' : 'badge-warning'}`}>
                          {order.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">{new Date(order.createdAt || order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;