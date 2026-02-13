import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PaymentCancel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        toast.error("Payment Cancelled / Failed");

        const timer = setTimeout(() => {
            navigate('/orders');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white font-sans p-6">
            <div className="text-center max-w-2xl">
                <div className="text-8xl mb-8">❌</div>

                <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
                    Payment Cancelled
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Your payment was not completed. No charges were made.
                </p>

                <div className="bg-white border-2 border-yellow-500 p-8 mb-8">
                    <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                        Order Status
                    </p>
                    <p className="text-2xl font-black text-yellow-600">
                        PENDING PAYMENT
                    </p>
                </div>

                <p className="text-sm text-gray-500 uppercase tracking-widest">
                    Redirecting to your orders...
                </p>
            </div>
        </div>
    );
};

export default PaymentCancel;
