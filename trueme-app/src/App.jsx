import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Cart from './pages/public/Cart';
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import Checkout from './pages/public/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/customer/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import About from './pages/public/About';
import ForgotPassword from './pages/auth/ForgotPassword';
import Wishlist from './pages/customer/Wishlist';
import SellerDashboard from './pages/seller/SellerDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-200">

        {/* Navigation is always visible */}
        <Navbar />

        {/* Dynamic Content */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/seller" element={<SellerDashboard />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;