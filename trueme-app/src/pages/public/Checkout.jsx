import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOrder } from '../../services/orderService';
import { clearCart } from '../../context/cartSlice';

const Checkout = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Handle Address Validation
  const [checkingAddress, setCheckingAddress] = useState(true);

  React.useEffect(() => {
    const checkAddress = async () => {
      if (isAuthenticated) {
        try {
          const { getMyAddress } = await import('../../services/userService');
          const address = await getMyAddress();
          if (!address || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
            toast.error("Address not found. Please fill in your address to proceed with the payment.");
            navigate('/profile?tab=address'); // Redirect to profile address tab
          }
        } catch (error) {
          // If address not found or error
          console.error("Address check failed", error);
          // Assuming if error means no address??
          // Let's assume if it throws (404?), we redirect.
          // But if it's unrelated error, we might block checkout.
          // Design decision: Warn user.
          // toast("Please ensure you have an address saved.");
        } finally {
          setCheckingAddress(false);
        }
      } else {
        setCheckingAddress(false);
      }
    };
    checkAddress();
  }, [isAuthenticated, navigate]);


  // Handle Checkout WITH PAYMENT INTEGRATION
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // 1. Strict Address Validation on Click
      const { getMyAddress } = await import('../../services/userService');
      const address = await getMyAddress();

      // Check for presence and all required fields (matching Dashboard.jsx fields)
      const hasStreet = address?.addressLine1 && address.addressLine1.trim() !== "";
      const hasCity = address?.city && address.city.trim() !== "";
      const hasState = address?.state && address.state.trim() !== "";
      const hasPincode = address?.postalCode && address.postalCode.trim() !== "";

      if (!address || !hasStreet || !hasCity || !hasState || !hasPincode) {
        toast.error("Address not found. Please fill in your address to proceed with the payment.");
        setLoading(false);
        navigate('/profile?tab=address');
        return; // CRITICAL: Stop execution before calling createOrder()
      }

      // 2. Proceed to Create Order
      // Backend creates order AND initiates payment in one call
      // Returns ApiResponse { message: "checkoutUrl", status: "PAYMENT_URL" }
      const response = await createOrder();

      // Extract checkout URL from response
      const checkoutUrl = response.message; // The URL is in the message field

      if (checkoutUrl && checkoutUrl.startsWith('http')) {
        toast.success("Order created! Redirecting to payment...");

        // Clear cart BEFORE redirecting to payment
        dispatch(clearCart());

        // Redirect user to Stripe Checkout
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No valid checkout URL received from server");
      }

    } catch (error) {
      console.error("Checkout Error:", error);

      // Show detailed error message from backend
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Checkout Failed. Please try again.";

      toast.error(errorMessage);
      setLoading(false);
    }
  };

  // Redirect if empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Your Bag is Empty</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-link text-black uppercase tracking-widest">Go to Shop</button>
      </div>
    );
  }

  const shipping = totalAmount > 499 ? 0 : 50;
  const finalTotal = totalAmount + shipping;

  return (
    <div className="min-h-screen bg-white py-16 font-sans text-black">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12 border-b border-black pb-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Checkout</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">Review Your Order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* LEFT: Order Items */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Items in Your Bag</h2>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                  <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                    <img src={item.imageUrl || "https://placehold.co/150"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold uppercase text-sm">{item.name}</h3>
                    <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                    <p className="font-mono text-sm mt-2">₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Order Summary & Checkout */}
          <div className="bg-gray-50 p-8 h-fit sticky top-24">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="uppercase text-gray-600">Subtotal</span>
                <span className="font-mono font-bold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="uppercase text-gray-600">Shipping</span>
                {shipping === 0 ? (
                  <span className="font-bold text-black">FREE</span>
                ) : (
                  <span className="font-mono font-bold">₹{shipping}</span>
                )}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-6"></div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold uppercase">Total</span>
              <span className="text-3xl font-black">₹{finalTotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="btn bg-black text-white w-full rounded-none h-14 uppercase tracking-widest hover:bg-gray-800 border-none text-sm"
              disabled={loading || !isAuthenticated}
            >
              {loading ? <span className="loading loading-spinner text-white"></span> : "Proceed to Payment"}
            </button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-error mt-4">Please login to checkout</p>
            )}

            <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest">
              Secure Stripe Payment | 256-bit Encryption
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
