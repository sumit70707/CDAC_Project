import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOrderDetails } from '../../services/orderService';
import { initiateCheckout } from '../../services/paymentService';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryingPayment, setRetryingPayment] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const data = await getOrderDetails(orderId);
            setOrder(data);
        } catch (err) {
            console.error("Failed to load order details", err);
            setError("Could not load order details.");
        } finally {
            setLoading(false);
        }
    };

    // TODO: Backend doesn't have retry payment endpoint yet
    // Payment retry should be implemented when backend supports it
    const handleRetryPayment = async () => {
        setRetryingPayment(true);
        toast.error("Payment retry not available yet. Please contact support.");
        setRetryingPayment(false);

        /* 
        // This will work once backend implements retry payment endpoint
        try {
            const paymentResponse = await initiateCheckout(orderId);
            if (paymentResponse.checkoutUrl) {
                window.location.href = paymentResponse.checkoutUrl;
            } else {
                toast.error("Failed to initiate payment. Please try again.");
                setRetryingPayment(false);
            }
        } catch (error) {
            console.error("Payment retry failed:", error);
            toast.error("Failed to retry payment. Please contact support.");
            setRetryingPayment(false);
        }
        */
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error || !order) return <div className="min-h-screen flex justify-center items-center text-error">{error || "Order not found"}</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-16 min-h-screen bg-white font-sans">
            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Order Details</h1>
                    <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">Order #{order.orderNumber}</p>
                </div>
                <Link to="/orders" className="text-sm font-bold uppercase tracking-widest underline hover:text-gray-600">Back to Orders</Link>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 bg-gray-50 p-8">
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Order Date</h4>
                    <p className="font-mono font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Order Status</h4>
                    <span className={`badge rounded-none uppercase text-[10px] font-bold p-3 ${order.orderStatus === 'DELIVERED'
                        ? 'bg-black text-white'
                        : order.orderStatus === 'SHIPPED'
                            ? 'bg-blue-600 text-white'
                            : order.orderStatus === 'PROCESSING'
                                ? 'bg-yellow-500 text-black'
                                : 'badge-outline'
                        }`}>
                        {order.orderStatus}
                    </span>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Status</h4>
                    <div className="flex items-center gap-3">
                        <span className={`badge rounded-none uppercase text-[10px] font-bold p-3 ${order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCEEDED'
                            ? 'bg-green-600 text-white'
                            : order.paymentStatus === 'PENDING'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-red-600 text-white'
                            }`}>
                            💳 {order.paymentStatus || 'PENDING'}
                        </span>
                        {(order.paymentStatus === 'PENDING' || order.paymentStatus === 'FAILED') && (
                            <button
                                onClick={handleRetryPayment}
                                disabled={retryingPayment}
                                className="btn btn-xs bg-black text-white rounded-none uppercase tracking-widest"
                            >
                                {retryingPayment ? 'Processing...' : 'Pay Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Order Items</h2>
                <div className="space-y-6">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-6 border-b border-gray-100 pb-6">
                            <div className="w-24 h-28 bg-gray-100 flex-shrink-0">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold uppercase tracking-wide text-lg">{item.productName}</h3>
                                <div className="flex gap-8 mt-2 text-sm text-gray-600">
                                    <p>Quantity: <span className="font-bold text-black">{item.quantity}</span></p>
                                    <p>Price: <span className="font-mono font-bold text-black">₹{item.unitPrice}</span></p>
                                </div>
                                {item.fulfillmentStatus && (
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-3">
                                        Fulfillment: {item.fulfillmentStatus}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase text-gray-500 mb-1">Subtotal</p>
                                <p className="font-mono text-xl font-bold">₹{item.subtotal}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-8 max-w-md ml-auto">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">Order Summary</h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="uppercase text-gray-600">Total Amount</span>
                        <span className="font-mono font-bold text-lg">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="uppercase text-gray-600">Currency</span>
                        <span className="font-bold">{order.currency || 'INR'}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OrderDetails;
