import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendForgotPasswordOtp, forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendForgotPasswordOtp(email);
      toast.success(`OTP sent to ${email}`);
      setStep(2);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password (Corrected: Backend handles OTP verification + Reset in one go)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Changed: Pass all 3 args to the new service method
      await forgotPassword(email, otp, newPassword);
      toast.success("Password reset successful! Please login.");
      navigate('/login');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to reset password. Check OTP.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-black uppercase tracking-tighter text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter OTP and your new password"}
          </p>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="input input-bordered w-full rounded-none focus:outline-none focus:border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn bg-black text-white w-full rounded-none uppercase tracking-widest hover:bg-gray-800"
            >
              {loading ? <span className="loading loading-spinner"></span> : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP + NEW PASSWORD */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                required
                className="input input-bordered w-full rounded-none text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:border-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="------"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                required
                className="input input-bordered w-full rounded-none focus:outline-none focus:border-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                className="input input-bordered w-full rounded-none focus:outline-none focus:border-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn bg-black text-white w-full rounded-none uppercase tracking-widest hover:bg-gray-800"
            >
              {loading ? <span className="loading loading-spinner"></span> : "Reset Password"}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black hover:underline">Resend OTP</button>
            </div>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="font-medium text-black hover:text-gray-800 underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
