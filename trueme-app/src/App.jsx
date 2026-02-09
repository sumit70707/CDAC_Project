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

import Dashboard from './pages/customer/Dashboard'; // Customer Profile
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/customer/OrderDetails';
import Wishlist from './pages/customer/Wishlist';

import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';

// Helper to redirect to correct dashboard
const DashboardRedirect = () => {
  // You might want to enhance this to check role and redirect accordingly
  // For now, it just redirects to login or handled by ProtectedRoute
  return <Navigate to="/profile" replace />;
};

// Component to handle side effects of Auth (like fetching cart)
const AuthHandler = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return null;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#000',
            border: '1px solid #000',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AuthHandler />
      <Routes>
        {/* --- PUBLIC ROUTES (MainLayout) --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SELLER']}>
              <Shop />
            </ProtectedRoute>
          } />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Checkout & Payment */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Route>

        {/* --- AUTH ROUTES (AuthLayout) --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* --- CUSTOMER PROTECTED ROUTES (MainLayout) --- */}
        <Route element={<MainLayout />}>
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'SELLER']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/orders/:orderId" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <OrderDetails />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <Wishlist />
            </ProtectedRoute>
          } />
        </Route>

        {/* --- ADMIN / SELLER DASHBOARD (AdminLayout) --- */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SELLER']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          {/* Add more inner routes here later */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;