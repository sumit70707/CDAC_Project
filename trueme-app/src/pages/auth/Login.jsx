import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../services/authService';
import { loginSuccess } from '../../context/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call API
      const data = await loginUser(formData);
      console.log("Login API Response:", data);

      // 2. Save to Redux
      dispatch(loginSuccess({
        user: data.user,
        token: data.token
      }));

      alert("Login Successful!");
      navigate('/'); 

    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed: " + (error.message || "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border border-gray-100">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-6">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input 
                type="email" 
                name="email" 
                placeholder="email@example.com" 
                className="input input-bordered" 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter password" 
                className="input input-bordered" 
                onChange={handleChange} 
                required 
              />
              {/* --- FORGOT PASSWORD LINK ADDED HERE --- */}
              <label className="label">
                <Link to="/forgot-password" class="label-text-alt link link-hover text-primary font-medium">
                  Forgot password?
                </Link>
              </label>
            </div>
            
            {/* Submit Button */}
            <button className="btn btn-primary mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Login"}
            </button>
          </form>

          <div className="divider my-4">OR</div>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="link link-primary font-bold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;