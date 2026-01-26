import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderService';
import { clearCart } from '../../context/cartSlice';

const Checkout = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);

  // Address Form State (Matches your Database Schema)
  const [address, setAddress] = useState({
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('CARD'); // Default Mock Payment

  // Handle Input Change
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      items: cartItems,
      totalAmount: totalAmount,
      shippingAddress: address,
      paymentMethod: paymentMethod,
      customerId: user?.id || 1 // Fallback for mock
    };

    try {
      const response = await createOrder(orderPayload);
      
      alert(`🎉 Success! Your Order Number is: ${response.orderId}`);
      
      // Clear Cart and Redirect to Home (or Order History later)
      dispatch(clearCart());
      navigate('/');

    } catch (error) {
      alert("Order Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if empty
  if (cartItems.length === 0) {
    return <div className="p-10 text-center">Your cart is empty! <button onClick={() => navigate('/shop')} className="btn btn-link">Go Shop</button></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
      
      {/* LEFT: Shipping Form */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
        <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
          
          <div className="form-control">
            <label className="label"><span className="label-text">Address Line 1</span></label>
            <input type="text" name="addressLine1" required className="input input-bordered" onChange={handleChange} placeholder="House No, Street Area" />
          </div>

          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label"><span className="label-text">City</span></label>
              <input type="text" name="city" required className="input input-bordered" onChange={handleChange} />
            </div>
            <div className="form-control w-1/2">
              <label className="label"><span className="label-text">State</span></label>
              <input type="text" name="state" required className="input input-bordered" onChange={handleChange} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label"><span className="label-text">Postal Code</span></label>
              <input type="text" name="postalCode" required className="input input-bordered" onChange={handleChange} />
            </div>
            <div className="form-control w-1/2">
              <label className="label"><span className="label-text">Country</span></label>
              <input type="text" name="country" value="India" readOnly className="input input-bordered bg-gray-100" />
            </div>
          </div>

          {/* Payment Method Selection (Mock) */}
          <h3 className="text-xl font-bold mt-6 mb-2">Payment Method</h3>
          <div className="flex gap-4">
            <label className="label cursor-pointer gap-2 border p-3 rounded-lg hover:border-primary">
              <input type="radio" name="payment" className="radio radio-primary" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
              <span className="label-text">Credit/Debit Card</span>
            </label>
            <label className="label cursor-pointer gap-2 border p-3 rounded-lg hover:border-primary">
              <input type="radio" name="payment" className="radio radio-primary" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
              <span className="label-text">UPI</span>
            </label>
          </div>

        </form>
      </div>

      {/* RIGHT: Order Summary */}
      <div>
        <div className="card bg-base-100 shadow-xl border border-gray-200">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Order</h2>
            
            {/* List of Items (Compact) */}
            <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold">₹{item.totalPrice}</span>
                </li>
              ))}
            </ul>

            <div className="divider"></div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total To Pay</span>
              <span className="text-primary">₹{totalAmount}</span>
            </div>

            <div className="card-actions mt-6">
              <button 
                type="submit" 
                form="checkout-form" 
                className="btn btn-primary btn-block" 
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : "Place Order & Pay"}
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-2">
              Secure Checkout powered by Stripe (Mock)
            </p>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;