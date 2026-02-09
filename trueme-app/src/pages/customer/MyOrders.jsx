import React, { useEffect, useState } from 'react';
import { getMyOrders, cancelOrder } from '../../services/orderService';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import toast from 'react-hot-toast';

const MyOrders = () => {
    const navigate = useNavigate(); // Hook
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // response is { message, status, data: { content: [], ... } }
            const response = await getMyOrders();
            // Extract the Page content
            const orderList = response?.data?.content || [];
            setOrders(orderList);
        } catch (err) {
            console.error("Failed to load orders", err);
            setError("Could not load your orders.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder(orderId);
            toast.success("Order cancelled successfully");
            fetchOrders(); // Refresh list
        } catch (error) {
            toast.error("Failed to cancel order (Feature might not be supported by backend yet)");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-white">
            <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">My Orders</h1>
                    <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">Track & Return</p>
                </div>
                <Link to="/profile" className="text-sm font-bold uppercase tracking-widest underline hover:text-gray-600">Back to Dashboard</Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 border border-gray-100 bg-gray-50">
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-4">No orders found</h3>
                    <Link to="/shop" className="btn btn-neutral rounded-none uppercase tracking-widest px-8">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            onClick={() => navigate(`/orders/${order.orderId}`)}
                            className="border border-gray-200 block hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            {/* Header */}
                            <div className="bg-gray-50 p-6 flex flex-wrap gap-8 justify-between items-center text-sm border-b border-gray-200">
                                <div>
                                    <p className="font-bold text-xs uppercase text-gray-400 mb-1">Order Placed</p>
                                    <p className="font-mono font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="font-mono">
                                    <p className="font-bold text-xs uppercase text-gray-400 mb-1">Total</p>
                                    <p className="font-bold">₹{order.totalAmount}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-xs uppercase text-gray-400 mb-1">Order #</p>
                                    <p className="font-mono font-bold">{order.orderNumber}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-auto">
                                    {/* Payment Status Badge */}
                                    <span className={`badge rounded-none uppercase text-[10px] font-bold p-3 ${order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCEEDED'
                                        ? 'bg-green-600 text-white'
                                        : order.paymentStatus === 'PENDING'
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-red-600 text-white'
                                        }`}>
                                        💳 {order.paymentStatus || 'PENDING'}
                                    </span>

                                    {/* Order Status Badge */}
                                    <span className={`badge rounded-none uppercase text-[10px] font-bold p-3 ${order.orderStatus === 'DELIVERED'
                                        ? 'bg-black text-white'
                                        : order.orderStatus === 'SHIPPED'
                                            ? 'bg-blue-600 text-white'
                                            : order.orderStatus === 'CANCELLED'
                                                ? 'bg-red-600 text-white line-through'
                                                : 'badge-outline'
                                        }`}>
                                        {order.orderStatus}
                                    </span>

                                    {/* Cancel Button */}
                                    {/* Show only if status is PENDING (or not shipped/delivered/cancelled) */}
                                    {(order.orderStatus === 'PENDING' || order.orderStatus === 'CREATED') && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCancel(order.orderId); }}
                                            className="btn btn-xs btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-none uppercase tracking-widest"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Items */}
                            <div className="p-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 mb-6 last:mb-0">
                                        <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Img</div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold uppercase tracking-wide">{item.productName}</h4>
                                            {/* No description available in OrderItem, keeping it minimal */}
                                            <div className="flex gap-6 mt-2 text-sm text-gray-600">
                                                <p>Qty: {item.quantity}</p>
                                                <p className="font-mono">₹{item.unitPrice}</p>
                                            </div>
                                            {item.fulfillmentStatus && (
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mt-2">Status: {item.fulfillmentStatus}</p>
                                            )}
                                        </div>
                                        <div className="self-center">
                                            {order.orderStatus === 'DELIVERED' && (
                                                <Link to={`/product/${item.productId}`} className="text-xs font-bold underline hover:text-black text-gray-500">
                                                    Write a Review
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
