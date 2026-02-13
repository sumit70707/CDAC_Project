import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../context/authSlice';

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="drawer lg:drawer-open">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

            {/* Page Content */}
            <div className="drawer-content flex flex-col min-h-screen bg-base-200">
                {/* Navbar for Mobile */}
                <div className="w-full navbar bg-base-100 lg:hidden shadow-sm">
                    <div className="flex-none">
                        <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 font-bold text-xl">
                        {isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}
                    </div>
                </div>

                <div className="p-8">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-20">
                <label htmlFor="admin-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
                    {/* Brand */}
                    <li className="mb-4">
                        <Link to="/" className="text-2xl font-bold font-serif italic text-primary px-4">TrueMe <span className="text-xs font-sans not-italic text-neutral-content badge badge-neutral ml-2">{isAdmin ? 'Admin' : 'Seller'}</span></Link>
                    </li>

                    {/* Links
                    <li><Link to={isAdmin ? "/admin" : "/seller/dashboard"}>Dashboard Overview</Link></li>

                    {isAdmin && (
                        <>
                            <li><Link to="/admin/users">User Management</Link></li>
                        </>
                    )}

                    {!isAdmin && ( // Seller Links
                        <>
                            <li><Link to="/seller/dashboard?view=PRODUCTS">My Products</Link></li>
                            <li><Link to="/seller/dashboard?view=ORDERS">Order Management</Link></li>
                        </>
                    )} */}

                    <div className="divider"></div>
                    <li><button onClick={handleLogout} className="text-error">Logout</button></li>
                </ul>
            </div>
        </div>
    );
};

export default AdminLayout;
