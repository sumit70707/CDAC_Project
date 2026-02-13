import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './context/cartSlice';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import ProductDetails from './pages/public/ProductDetails';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import PaymentSuccess from './pages/public/PaymentSuccess';
import PaymentCancel from './pages/public/PaymentCancel';
import Blog from './pages/public/Blog';
import BlogDetails from './pages/public/BlogDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import Dashboard from './pages/customer/Dashboard';
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/customer/OrderDetails';
import Wishlist from './pages/customer/Wishlist';

import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';

// Component to handle side effects of Auth
const AuthHandler = () => {
  const { isAuthenticated, role } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isAuthenticated && role === 'CUSTOMER') {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, role, dispatch]);

  return null;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <AuthHandler />

      <Routes>

        {/* ================= PAYMENT REDIRECT ROUTES ================= */}
        {/* These must NOT be inside layouts */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/shop"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SELLER']}>
                <Shop />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* ================= AUTH ROUTES ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route element={<MainLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SELLER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <Wishlist />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= ADMIN / SELLER ================= */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SELLER']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
