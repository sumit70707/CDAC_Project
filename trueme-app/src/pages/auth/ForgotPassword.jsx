import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    console.log("🔑 Forgot Password - Sending request:", { email, passwordLength: newPassword.length });

    try {
      const response = await forgotPassword(email, newPassword);
      console.log("✅ Forgot Password - Success response:", response);

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
      }, 2000);
    } catch (err) {
      console.error("❌ Forgot Password - Error:", err);
      console.error("❌ Error details:", err.response?.data);

      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight font-serif">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and new password.
          </p>
        </div>

        {message && (
          <div role="alert" className="alert alert-success rounded-lg shadow-md border-l-4 border-green-500 p-4">
            <span className="font-medium text-sm">{message}</span>
          </div>
        )}

        {error && (
          <div role="alert" className="alert alert-error rounded-lg shadow-md border-l-4 border-red-500 p-4">
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg hover:shadow-xl disabled:opacity-70 transition-all"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm text-white"></span> : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="font-bold underline hover:text-primary">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
