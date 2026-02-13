import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Show success toast
        toast.success('Payment successful! Your order has been placed.');

        // Redirect after 3 seconds
        const timer = setTimeout(() => {
            navigate('/orders');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white font-sans p-6">
            <div className="text-center max-w-2xl">
                <div className="text-8xl mb-8 animate-bounce">✅</div>

                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
                    Payment Successful!
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>

                <div className="bg-white border-2 border-green-600 p-8 mb-8">
                    <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                        Payment Status
                    </p>
                    <p className="text-2xl font-black text-green-600">
                        PAID ✓
                    </p>
                </div>

                <p className="text-sm text-gray-500 uppercase tracking-widest">
                    Redirecting to your orders...
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
