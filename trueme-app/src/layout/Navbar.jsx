import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../context/authSlice';

const Navbar = () => {
  // 1. Get Auth State (User info)
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // 2. Get Cart State (Total items)
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-gray-100 sticky top-0 z-50 px-4 lg:px-10">
      
      {/* --- LEFT: LOGO --- */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl tracking-tighter font-bold text-primary hover:bg-transparent">
          TrueMe<span className="text-gray-800">.</span>
        </Link>
      </div>

      {/* --- CENTER: MENU (Desktop) --- */}
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal px-1 font-medium text-base gap-2">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </div>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex-none gap-4">
        
        {/* 1. SHOPPING CART ICON */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="badge badge-sm indicator-item bg-primary text-white border-none">
                {totalQuantity}
              </span>
            </div>
          </div>
          
          {/* Mini Cart Preview */}
          <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow-lg border border-gray-100">
            <div className="card-body">
              <span className="text-lg font-bold text-center">{totalQuantity} Items</span>
              <div className="card-actions">
                <Link to="/cart" className="btn btn-primary btn-block btn-sm">View Cart</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. USER AUTH SECTION */}
        {isAuthenticated ? (
          // IF LOGGED IN: Show User Avatar & Dropdown
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder border border-gray-200">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="text-xl font-bold uppercase">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-gray-100">
              <li className="menu-title px-4 py-2 text-gray-500">
                Hello, {user?.firstName}
              </li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <div className="divider my-1"></div> 
              <li><button onClick={handleLogout} className="text-error">Logout</button></li>
            </ul>
          </div>
        ) : (
          // IF NOT LOGGED IN: Show Login/Register Buttons
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-primary btn-sm px-6">Login</Link>
            <Link to="/register" className="btn btn-outline btn-primary btn-sm px-6 hidden sm:flex">Register</Link>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Navbar;