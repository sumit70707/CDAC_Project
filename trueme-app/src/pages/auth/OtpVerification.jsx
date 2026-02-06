import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmailOtp, sendEmailOtp, registerUser } from '../../services/authService';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // We expect formData to be passed from Register page
    const formData = location.state?.formData;
    const email = formData?.email;

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    // Redirect if no form data (e.g. direct access)
    if (!email || !formData) {
        return <div className="p-10 text-center">No registration data found. Please register first.</div>;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Step 1: Verify OTP
            await verifyEmailOtp({ email, otp });

            // Step 2: Complete Registration
            // Now that email is verified, backend should allow registration
            await registerUser(formData);

            // Success -> Redirect to login
            navigate('/login', { state: { message: 'Registration and verification successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setMessage('');
        setError(null);
        try {
            await sendEmailOtp(email);
            setMessage('OTP resent successfully!');
        } catch (err) {
            setError('Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-serif">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We sent a 6-digit code to <strong>{email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error rounded-lg text-sm font-medium">
                        <span>{error}</span>
                    </div>
                )}
                {message && (
                    <div className="alert alert-success rounded-lg text-sm font-medium">
                        <span>{message}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                    <div>
                        <label htmlFor="otp" className="sr-only">OTP</label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-black focus:border-black sm:text-lg tracking-widest text-center"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={handleResend}
                        className="text-sm font-medium text-gray-600 hover:text-black hover:underline"
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
