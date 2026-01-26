import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Requesting Password Reset for:", email);
      
      // Call Service
      await forgotPassword(email);
      
      // Show Success UI
      setSubmitted(true);

    } catch (error) {
      console.error("Reset Error:", error);
      alert("Failed to send link: " + (error.message || "User not found"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border border-gray-100">
        <div className="card-body">
          
          {!submitted ? (
            /* --- FORM STATE --- */
            <>
              <h2 className="card-title text-2xl font-bold justify-center mb-2">Reset Password</h2>
              <p className="text-center text-gray-500 mb-6 text-sm">
                Enter your registered email and we will send you a reset link.
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="input input-bordered" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                <button className="btn btn-primary mt-2" disabled={loading}>
                   {loading ? <span className="loading loading-spinner"></span> : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            /* --- SUCCESS STATE --- */
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-success mb-2">Check your mail</h2>
              <p className="text-gray-600 mb-6 text-sm">
                We have sent a password reset link to <br/><strong>{email}</strong>.
              </p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="btn btn-outline btn-sm btn-wide"
              >
                Resend Link
              </button>
            </div>
          )}

          <div className="text-center mt-6 border-t pt-4">
            <Link to="/login" className="link link-hover text-sm font-medium text-gray-600">
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;