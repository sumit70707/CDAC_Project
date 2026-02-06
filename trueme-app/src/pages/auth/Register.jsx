
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, sendEmailOtp, verifyEmailOtp } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // If email changes, reset verification
    if (e.target.name === 'email') {
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtp('');
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Please enter a valid email address first.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      await sendEmailOtp(formData.email);
      setOtpSent(true);
      setMessage(`OTP sent to ${formData.email} `);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError(null);
    setOtpError(null);

    try {
      // Backend expects (email, otp) as separate params, not an object
      await verifyEmailOtp(formData.email, otp);
      setIsEmailVerified(true);
      setOtpSent(false);
      setMessage('Email verified successfully!');
      setOtp(''); // Clear OTP field
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Verification failed.';
      setOtpError(errorMsg); // Show error below input
      setError(errorMsg); // Also show global error if needed, or maybe just local? keeping both for now.
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError("Please verify your email address to continue.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await registerUser(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 shadow-xl rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join TrueMe and start your journey
          </p>
        </div>

        {error && (
          <div role="alert" className="alert alert-error rounded-lg shadow-md border-l-4 border-red-500 p-4">
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {message && (
          <div role="alert" className="alert alert-success rounded-lg shadow-md border-l-4 border-green-500 p-4">
            <span className="font-medium text-sm">{message}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" name="firstName" placeholder="Jane" className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" name="lastName" placeholder="Doe" className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            {/* Email & Verification Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex gap-2 items-center">
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className={`appearance-none relative block w-full px-4 py-3 border ${isEmailVerified ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-all`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || otpSent || !formData.email}
                    className="whitespace-nowrap px-6 py-3 border border-transparent text-sm font-bold rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all h-full"
                  >
                    {loading && !otpSent ? <span className="loading loading-spinner loading-xs"></span> : "Verify"}
                  </button>
                )}
                {isEmailVerified && (
                  <div className="flex items-center px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg whitespace-nowrap h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-sm">Verified</span>
                  </div>
                )}
              </div>
              {/* OTP Input - Inline */}
              {otpSent && !isEmailVerified && (
                <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
                  <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Enter Verification Code</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      name="otp"
                      placeholder="XXXXXX"
                      className={`flex-1 appearance-none block w-full px-4 py-3 border ${otpError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm tracking-widest text-center text-lg font-mono uppercase`}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        if (otpError) setOtpError(null);
                      }}
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="px-6 py-3 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all shadow-sm"
                    >
                      {loading ? <span className="loading loading-spinner loading-xs"></span> : "Confirm"}
                    </button>
                  </div>
                  {otpError && (
                    <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                      <span>⚠</span> {otpError}
                    </p>
                  )}
                  <div className="mt-3 text-right">
                    <button type="button" onClick={handleSendOtp} className="text-xs font-bold text-gray-500 hover:text-black hover:underline uppercase tracking-wider">
                      Resend Code?
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" placeholder="+91 9876543210" className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm" value={formData.phone} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" placeholder="••••••••" className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm" value={formData.password} onChange={handleChange} required minLength={8} />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
          </div>

          <button type="submit" disabled={!isEmailVerified || loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading && isEmailVerified ? <span className="loading loading-spinner loading-sm text-white"></span> : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-black hover:text-gray-800 transition-colors duration-200 underline underline-offset-2">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;