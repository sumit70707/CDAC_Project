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
    <div className="navbar bg-white border-b border-black sticky top-0 z-50 px-6 md:px-12 h-20">

      {/* --- LEFT: LOGO --- */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-black uppercase tracking-tighter hover:text-gray-600 transition-colors">
          TrueMe<span className="text-black">.</span>
        </Link>
      </div>

      {/* --- CENTER: MENU (Desktop) --- */}
      <div className="flex-none hidden lg:block">
        <ul className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          <li><Link to="/" className="hover:border-b hover:border-black pb-1 transition-all">Home</Link></li>
          {isAuthenticated && (
            <li><Link to="/shop" className="hover:border-b hover:border-black pb-1 transition-all">Shop</Link></li>
          )}
          <li><Link to="/blog" className="hover:border-b hover:border-black pb-1 transition-all">Journal</Link></li>
        </ul>
      </div>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex-none gap-6 items-center">

        {/* 1. SHOPPING CART ICON (Visible only if logged in) */}
        {isAuthenticated && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle hover:bg-transparent">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalQuantity > 0 && (
                  <span className="badge badge-xs indicator-item bg-black text-white border-none rounded-full h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {totalQuantity}
                  </span>
                )}
              </div>
            </div>

            {/* Mini Cart Preview */}
            <div tabIndex={0} className="card card-compact dropdown-content bg-white z-[1] mt-3 w-64 border border-black rounded-none shadow-none">
              <div className="card-body">
                <span className="text-lg font-bold text-center uppercase tracking-wider">{totalQuantity} Items</span>
                <div className="card-actions">
                  <Link to="/cart" className="btn bg-black text-white btn-block btn-sm rounded-none uppercase tracking-widest hover:bg-gray-800">View Bag</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USER AUTH SECTION */}
        {isAuthenticated ? (
          // IF LOGGED IN: Show User Avatar & Dropdown
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder border border-black hover:bg-black hover:text-white transition-colors">
              <div className="bg-transparent text-current rounded-full w-10">
                <span className="text-sm font-bold uppercase">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-0 shadow-none menu menu-sm dropdown-content bg-white w-52 border border-black rounded-none">
              <li className="menu-title px-4 py-3 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-widest text-center">
                Hi, {user?.firstName}
              </li>
              <li><Link to="/profile" className="rounded-none hover:bg-gray-100 py-3 uppercase text-xs font-bold tracking-wide">Profile</Link></li>
              <li><Link to="/orders" className="rounded-none hover:bg-gray-100 py-3 uppercase text-xs font-bold tracking-wide">My Orders</Link></li>
              <li><Link to="/wishlist" className="rounded-none hover:bg-gray-100 py-3 uppercase text-xs font-bold tracking-wide">Wishlist</Link></li>
              <div className="divider my-0"></div>
              <li><button onClick={handleLogout} className="rounded-none hover:bg-red-50 text-red-600 py-3 uppercase text-xs font-bold tracking-wide">Logout</button></li>
            </ul>
          </div>
        ) : (
          // IF NOT LOGGED IN: Show Login/Register Buttons
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest items-center">
            <Link to="/login" className="px-4 py-2 hover:bg-gray-100 transition-colors uppercase">Login</Link>
            <Link to="/register" className="btn btn-sm bg-black text-white hover:bg-gray-800 rounded-none border-none px-6 uppercase">Join</Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;