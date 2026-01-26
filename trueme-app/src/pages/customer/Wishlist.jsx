import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Corrected imports: specific actions from slice
import { removeItemFromWishlist, setWishlistItems } from '../../context/wishlistSlice';
import { addToCart } from '../../context/cartSlice';
import { getWishlist, removeFromWishlist as removeService } from '../../services/wishlistService';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist(); // Call Service
        dispatch(setWishlistItems(data)); // Save to Redux
      } catch (error) {
        console.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [dispatch]);

  const handleRemove = async (id) => {
    await removeService(id);
    dispatch(removeItemFromWishlist(id));
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart(product));
    handleRemove(product.id);
  };

  if (loading) return <div className="p-10 text-center">Loading Wishlist...</div>;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-6xl">💔</div>
        <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
        <Link to="/shop" className="btn btn-primary btn-outline">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ({items.length})</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product.id} className="card bg-base-100 shadow-xl border border-gray-100">
            <figure className="h-48 relative">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => handleRemove(product.id)}
                className="btn btn-circle btn-sm absolute top-2 right-2 bg-base-100 border-none shadow-sm hover:bg-red-100"
                title="Remove"
              >
                ✕
              </button>
            </figure>
            <div className="card-body p-4">
              <h2 className="card-title text-base">{product.name}</h2>
              <p className="font-bold text-primary">₹{product.price}</p>
              <div className="card-actions justify-end mt-2">
                <button 
                  onClick={() => handleMoveToCart(product)}
                  className="btn btn-sm btn-primary w-full"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;