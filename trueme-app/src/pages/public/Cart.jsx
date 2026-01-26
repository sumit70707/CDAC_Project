import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart } from '../../context/cartSlice';

const Cart = () => {
  // 1. Get Cart Data from Redux
  const { cartItems, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-3xl font-bold text-gray-400">Your Cart is Empty 🛒</h2>
        <p className="text-gray-500">Looks like you haven't added any skincare products yet.</p>
        <Link to="/shop" className="btn btn-primary mt-4">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* LEFT SIDE: Cart Items List */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart ({totalQuantity} items)</h1>

        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card card-side bg-base-100 shadow-sm border border-base-200 p-4 items-center">

              {/* Product Image */}
              <figure className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </figure>

              {/* Product Details */}
              <div className="card-body py-0 px-6 flex-1">
                <h2 className="card-title text-lg">{item.name}</h2>
                <p className="text-gray-500 text-sm">₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  className="btn btn-circle btn-sm btn-ghost border-gray-300"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  -
                </button>
                <span className="font-bold w-4 text-center">{item.quantity}</span>
                <button
                  className="btn btn-circle btn-sm btn-ghost border-gray-300"
                  onClick={() => dispatch(addToCart(item))} // Adding same item increases qty
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right w-24 font-bold text-lg">
                ₹{item.totalPrice}
              </div>

            </div>
          ))}
        </div>

        {/* Clear Cart Button */}
        <button
          onClick={() => dispatch(clearCart())}
          className="btn btn-ghost text-error mt-4 btn-sm"
        >
          Clear Cart
        </button>
      </div>

      {/* RIGHT SIDE: Order Summary */}
      <div className="lg:col-span-1">
        <div className="card bg-base-100 shadow-xl border border-base-200 sticky top-24">
          <div className="card-body">
            <h2 className="card-title mb-4">Order Summary</h2>

            <div className="flex justify-between text-gray-500 mb-2">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-500 mb-2">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-gray-500 mb-6">
              <span>Tax (GST)</span>
              <span>₹0.00</span>
            </div>

            <div className="divider my-0"></div>

            <div className="flex justify-between font-bold text-xl my-4">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="card-actions flex-col gap-3">
              <Link to="/checkout" className="btn btn-primary btn-block text-lg">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="btn btn-block btn-ghost">
                Continue Shopping
              </Link>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;