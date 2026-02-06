import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handlePaymentCancel } from '../../services/paymentService';

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (sessionId) {
            // Notify backend about cancellation
            handlePaymentCancel(sessionId).catch(err => {
                console.error("Failed to notify backend about cancellation:", err);
            });
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white font-sans p-6">
            <div className="text-center max-w-2xl">
                <div className="text-8xl mb-8">💳</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Payment Cancelled</h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Your payment was cancelled. No charges have been made to your account.
                </p>

                <div className="bg-white border-2 border-yellow-500 p-8 mb-8">
                    <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Order Status</p>
                    <p className="text-2xl font-black text-yellow-600">PENDING PAYMENT</p>
                    <p className="text-sm text-gray-500 mt-4">Your order has been created but payment was not completed.</p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/orders')}
                        className="btn bg-black text-white rounded-none uppercase tracking-widest px-8"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/cart')}
                        className="btn btn-outline rounded-none uppercase tracking-widest px-8"
                    >
                        Back to Cart
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-8 uppercase tracking-widest">
                    You can retry payment from your orders page
                </p>
            </div>
        </div>
    );
};

export default PaymentCancel;
