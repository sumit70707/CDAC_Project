import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCartServer, removeCartServer, clearCart } from '../../context/cartSlice';

const Cart = () => {
  const { cartItems, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate Shipping (Free > ₹499)
  const shipping = totalAmount > 499 ? 0 : 50;
  const finalTotal = totalAmount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Your Bag is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Your skincare routine is waiting. Add some essentials to get started.</p>
        <Link to="/shop" className="btn bg-black text-white hover:bg-gray-800 rounded-none px-12 border-none">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 font-sans text-black">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Your Bag <span className="text-gray-400 text-3xl align-top">({totalQuantity})</span></h1>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-xs uppercase tracking-widest underline hover:text-gray-500"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* LEFT: Cart Items */}
          <div className="lg:col-span-8">
            <div className="flex flex-col">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center border-b border-gray-200 py-8 gap-8 group">

                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img
                      src={item.imageUrl || "https://placehold.co/150"}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl uppercase tracking-tight">{item.name}</h3>
                      <p className="font-mono text-lg hidden sm:block">₹{item.totalPrice}</p>
                    </div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">{item.productType} • {item.ml || '100'}ml</p>

                    {/* Quantity Controls */}
                    <div className="inline-flex items-center border border-black">
                      <button
                        className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        onClick={() => dispatch(removeCartServer(item.id))}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        onClick={() => dispatch(addToCartServer(item))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-transparent sticky top-24">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-black pb-2">Order Summary</h2>

              <div className="flex justify-between mb-4 text-sm uppercase tracking-wide">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">₹{totalAmount}</span>
              </div>

              <div className="flex justify-between mb-4 text-sm uppercase tracking-wide">
                <span className="text-gray-600">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-black font-bold">FREE</span>
                ) : (
                  <span className="font-bold">₹{shipping}</span>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300 my-6"></div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold uppercase">Total</span>
                <span className="text-3xl font-black">₹{finalTotal}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn bg-black text-white w-full rounded-none h-14 uppercase tracking-widest hover:bg-gray-800 border-none text-sm"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 text-center text-xs text-gray-400 uppercase tracking-wider space-y-1">
                <p>Secure Checkout</p>
                <p>Free Returns within 30 days</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;