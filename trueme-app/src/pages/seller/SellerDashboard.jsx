import React, { useEffect, useState } from 'react';
import { getAllProducts, createProduct, activateProduct, increaseStock, decreaseStock } from '../../services/productService';
import { getSellerOrders, updateOrderItemStatus, getSellerSummary } from '../../services/sellerOrderService';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'analytics'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Analytics State
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === 'products' && products.length === 0) {
      loadProducts();
    } else if (activeTab === 'analytics' && !summary) {
      loadSummary();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await getSellerOrders(statusFilter, 0, 50);
      // Response is Page<SellerOrderItemResponseDto>
      const orderList = response.content || response;
      setOrders(orderList);
    } catch (error) {
      console.error("Failed to load orders", error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await getAllProducts({ page: 0, size: 100 });
      const productList = response.content || response;
      setProducts(productList);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await getSellerSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to load summary", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleStatusUpdate = async (orderItemId, newStatus) => {
    try {
      await updateOrderItemStatus(orderItemId, newStatus);
      setOrders(orders.map(o => o.orderItemId === orderItemId ? { ...o, fulfillmentStatus: newStatus } : o));
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const handleProductAdded = () => {
    setShowAddProduct(false);
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Header */}
      <div className="mb-12 border-b border-black pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Seller Dashboard</h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">Manage Orders & Products</p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-6 mb-12 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
        >
          📦 Customer Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'products' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
        >
          🛍️ My Products
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'analytics' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
        >
          📊 Analytics
        </button>
      </div>

      {/* ========== TAB: CUSTOMER ORDERS ========== */}
      {activeTab === 'orders' && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">All Customer Orders</h2>
            <p className="text-sm text-gray-500 mb-6">Manage orders for your products from all customers. Update fulfillment status to keep customers informed.</p>

            {/* Status Filter */}
            <div className="flex gap-4">
              <button onClick={() => setStatusFilter(null)} className={`btn btn-sm rounded-none ${!statusFilter ? 'btn-neutral' : 'btn-outline'}`}>All Orders</button>
              <button onClick={() => setStatusFilter('PENDING')} className={`btn btn-sm rounded-none ${statusFilter === 'PENDING' ? 'btn-warning' : 'btn-outline'}`}>Pending</button>
              <button onClick={() => setStatusFilter('PROCESSING')} className={`btn btn-sm rounded-none ${statusFilter === 'PROCESSING' ? 'btn-info' : 'btn-outline'}`}>Processing</button>
              <button onClick={() => setStatusFilter('SHIPPED')} className={`btn btn-sm rounded-none ${statusFilter === 'SHIPPED' ? 'btn-primary' : 'btn-outline'}`}>Shipped</button>
              <button onClick={() => setStatusFilter('DELIVERED')} className={`btn btn-sm rounded-none ${statusFilter === 'DELIVERED' ? 'btn-success' : 'btn-outline'}`}>Delivered</button>
            </div>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full border-t border-black">
                <thead>
                  <tr className="border-b border-black text-black uppercase text-xs tracking-widest font-bold">
                    <th className="rounded-none bg-gray-50">Order #</th>
                    <th className="rounded-none bg-gray-50">Product</th>
                    <th className="rounded-none bg-gray-50">Customer</th>
                    <th className="rounded-none bg-gray-50">Qty</th>
                    <th className="rounded-none bg-gray-50">Price</th>
                    <th className="rounded-none bg-gray-50">Status</th>
                    <th className="rounded-none bg-gray-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-12 text-gray-400">No orders found.</td></tr>
                  ) : orders.map((orderItem) => (
                    <tr key={orderItem.orderItemId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="font-mono text-sm font-bold">{orderItem.orderNumber || `ORD-${orderItem.orderId}`}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-bold text-sm">{orderItem.productName}</p>
                            <p className="text-xs text-gray-500">ID: {orderItem.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">Customer</td>
                      <td className="text-sm font-bold">{orderItem.quantity}</td>
                      <td className="font-mono">₹{orderItem.subtotal}</td>
                      <td>
                        <span className={`badge rounded-none uppercase text-[10px] font-bold ${orderItem.fulfillmentStatus === 'DELIVERED' ? 'bg-green-600 text-white' :
                          orderItem.fulfillmentStatus === 'SHIPPED' ? 'bg-blue-600 text-white' :
                            orderItem.fulfillmentStatus === 'PROCESSING' ? 'bg-yellow-500 text-black' :
                              'badge-outline'
                          }`}>
                          {orderItem.fulfillmentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <select
                          value={orderItem.fulfillmentStatus || 'PENDING'}
                          onChange={(e) => handleStatusUpdate(orderItem.orderItemId, e.target.value)}
                          disabled={orderItem.fulfillmentStatus === 'DELIVERED'}
                          className="select select-bordered select-xs rounded-none max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="RETURNED">Returned</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        {orderItem.fulfillmentStatus === 'DELIVERED' && (
                          <p className="text-xs text-gray-500 mt-1">✓ Final status</p>
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

      {/* ========== TAB: MY PRODUCTS ========== */}
      {activeTab === 'products' && (
        <>
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">My Products</h2>
              <p className="text-sm text-gray-500">Manage your product catalog and inventory.</p>
            </div>
            <button onClick={() => setShowAddProduct(!showAddProduct)} className="btn bg-black text-white rounded-none uppercase tracking-widest">
              {showAddProduct ? 'Cancel' : '+ Add Product'}
            </button>
          </div>

          {showAddProduct && (
            <AddProductForm onCancel={() => setShowAddProduct(false)} onSuccess={handleProductAdded} />
          )}

          {productsLoading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400">No products yet. Add your first product!</div>
              ) : products.map((product) => (
                <div key={product.id} className="border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 bg-gray-100" />
                  )}
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-2xl font-black">₹{product.price}</span>
                    <span className={`badge rounded-none ${product.qty > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      Stock: {product.qty}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => increaseStock(product.id, 10)} className="btn btn-xs btn-outline rounded-none flex-1">+10 Stock</button>
                    <button onClick={() => decreaseStock(product.id, 10)} className="btn btn-xs btn-outline rounded-none flex-1">-10 Stock</button>
                  </div>
                  {product.productStatus !== 'AVAILABLE' && (
                    <button onClick={() => activateProduct(product.id)} className="btn btn-success btn-xs rounded-none w-full mt-2 text-white">
                      Activate Product
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========== TAB: ANALYTICS ========== */}
      {activeTab === 'analytics' && (
        <>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Sales Analytics</h2>

          {summaryLoading ? (
            <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>
          ) : summary ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg">
                <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Total Orders</p>
                <p className="text-5xl font-black">{summary.totalOrders || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg">
                <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Total Revenue</p>
                <p className="text-5xl font-black">₹{summary.totalIncome || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-8 rounded-lg">
                <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Pending Orders</p>
                <p className="text-5xl font-black">{(summary.totalOrders || 0) - (summary.deliveredOrders || 0)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg">
                <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Completed</p>
                <p className="text-5xl font-black">{summary.deliveredOrders || 0}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">No analytics data available.</div>
          )}
        </>
      )}
    </div>
  );
};

// ========== ADD PRODUCT FORM COMPONENT ==========
const AddProductForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    ml: '',
    qty: '',
    skinType: 'NORMAL',
    productType: 'OTHER',
    productPhValue: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        ml: parseInt(formData.ml),
        qty: parseInt(formData.qty),
        productPhValue: parseFloat(formData.productPhValue)
      });
      alert("Product added successfully!");
      onSuccess();
    } catch (error) {
      alert("Failed to add product");
    }
  };

  return (
    <div className="bg-gray-50 p-8 mb-8 border border-gray-200">
      <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Add New Product</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Product Name</span></label>
          <input name="name" value={formData.name} onChange={handleChange} required className="input input-bordered rounded-none" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Product Image Path</span></label>
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="/images/product/your-image.jpg"
            required
            className="input input-bordered rounded-none"
          />
          <div className="label">
            <span className="label-text-alt text-gray-500 text-xs">
              * Enter the path exactly as: <code>/images/product/filename.jpg</code>
            </span>
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Price (₹)</span></label>
          <input name="price" type="number" step="0.01" min="10" value={formData.price} onChange={handleChange} required className="input input-bordered rounded-none" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Quantity (ml)</span></label>
          <input name="ml" type="number" min="10" value={formData.ml} onChange={handleChange} required className="input input-bordered rounded-none" placeholder="e.g. 50, 100, 200" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Stock Quantity</span></label>
          <input name="qty" type="number" value={formData.qty} onChange={handleChange} required className="input input-bordered rounded-none" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Skin Type</span></label>
          <select name="skinType" value={formData.skinType} onChange={handleChange} className="select select-bordered rounded-none">
            <option value="NORMAL">Normal</option>
            <option value="OILY">Oily</option>
            <option value="DRY">Dry</option>
            <option value="COMBINATION">Combination</option>
            <option value="SENSITIVE">Sensitive</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Product Type</span></label>
          <select name="productType" value={formData.productType} onChange={handleChange} className="select select-bordered rounded-none">
            <option value="FACEWASH">Facewash</option>
            <option value="CLEANSER">Cleanser</option>
            <option value="TONER">Toner</option>
            <option value="SERUM">Serum</option>
            <option value="MOISTURIZER">Moisturizer</option>
            <option value="SUNSCREEN">Sunscreen</option>
            <option value="MASK">Mask</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">pH Value</span></label>
          <input name="productPhValue" type="number" step="0.1" min="0" max="14" value={formData.productPhValue} onChange={handleChange} required className="input input-bordered rounded-none" placeholder="e.g. 5.5" />
        </div>
        <div className="form-control md:col-span-2">
          <label className="label"><span className="label-text font-bold uppercase text-xs tracking-widest">Description</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered rounded-none" rows="3"></textarea>
        </div>
        <div className="md:col-span-2 flex gap-4">
          <button type="button" onClick={onCancel} className="btn btn-outline rounded-none flex-1">Cancel</button>
          <button type="submit" className="btn bg-black text-white rounded-none flex-1">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default SellerDashboard;
