import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handlePaymentSuccess } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            setError("No session ID found");
            setProcessing(false);
            return;
        }

        // Call backend to verify and update payment status
        const verifyPayment = async () => {
            try {
                await handlePaymentSuccess(sessionId);
                setProcessing(false);

                // Show success toast
                toast.success('Payment successful! Your order has been placed.');

                // Redirect to My Orders after 2 seconds
                setTimeout(() => {
                    navigate('/orders');
                }, 2000);
            } catch (err) {
                console.error("Payment verification failed:", err);
                setError("Payment verification failed");
                setProcessing(false);
                toast.error('Payment verification failed. Please contact support.');
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    if (processing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white font-sans">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-black mb-4"></span>
                    <p className="text-xl font-bold uppercase tracking-widest">Verifying Payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white font-sans p-6">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">❌</div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Verification Failed</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button onClick={() => navigate('/orders')} className="btn bg-black text-white rounded-none uppercase tracking-widest">
                        View My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white font-sans p-6">
            <div className="text-center max-w-2xl">
                <div className="text-8xl mb-8 animate-bounce">✅</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Payment Successful!</h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>

                <div className="bg-white border-2 border-green-600 p-8 mb-8">
                    <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Payment Status</p>
                    <p className="text-2xl font-black text-green-600">PAID ✓</p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/orders')}
                        className="btn bg-black text-white rounded-none uppercase tracking-widest px-8"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/shop')}
                        className="btn btn-outline rounded-none uppercase tracking-widest px-8"
                    >
                        Continue Shopping
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-8 uppercase tracking-widest">
                    Order confirmation has been sent to your email
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
