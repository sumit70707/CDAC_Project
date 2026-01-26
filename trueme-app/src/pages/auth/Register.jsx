import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Matches your Database Schema exactly
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER' // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...payload } = formData;
      
      console.log("Sending Payload:", payload); // Debugging
      await registerUser(payload);
      
      alert("Registration Successful! Please Login.");
      navigate('/login');

    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration Failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-base-200 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-4">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            
            {/* Name Fields */}
            <div className="flex gap-2">
              <input type="text" name="firstName" placeholder="First Name" className="input input-bordered w-1/2" onChange={handleChange} required />
              <input type="text" name="lastName" placeholder="Last Name" className="input input-bordered w-1/2" onChange={handleChange} required />
            </div>

            {/* Contact */}
            <input type="email" name="email" placeholder="Email Address" className="input input-bordered" onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone Number" className="input input-bordered" onChange={handleChange} required />

            {/* Role Selection */}
            <select name="role" className="select select-bordered w-full" value={formData.role} onChange={handleChange}>
              <option value="CUSTOMER">I want to Buy (Customer)</option>
              <option value="SELLER">I want to Sell (Seller)</option>
            </select>

            {/* Passwords */}
            <input type="password" name="password" placeholder="Password" className="input input-bordered" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="input input-bordered" onChange={handleChange} required />

            {/* Button */}
            <button className="btn btn-primary mt-4" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account? <Link to="/login" className="link link-primary font-bold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;