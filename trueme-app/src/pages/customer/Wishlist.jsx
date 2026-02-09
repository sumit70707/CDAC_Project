import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getWishlist, removeFromWishlist } from '../../services/wishlistService';
import { addToCartServer } from '../../context/cartSlice';

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getWishlist(user.id);
      setWishlistItems(data || []);
    } catch (error) {
      console.error("Failed to load wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      // Backend expects remove by Product ID (and User ID)
      // wishlistService.removeFromWishlist(userId, productId)
      await removeFromWishlist(user.id, productId);
      // Optimistic UI update
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove item", error);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCartServer({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    }));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-white">
      <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">My Wishlist</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">{wishlistItems.length} Saved Items</p>
        </div>
        <Link to="/profile" className="text-sm font-bold uppercase tracking-widest underline hover:text-gray-600">Back to Dashboard</Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 border border-gray-100 bg-gray-50">
          <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Your wishlist is empty</h3>
          <Link to="/shop" className="btn btn-neutral rounded-none uppercase tracking-widest px-8">Browse Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <div key={product.id} className="group relative">
              {/* Image */}
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden mb-4">
                <img
                  src={product.imageUrl || "https://placehold.co/400x600"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-black hover:text-white p-2 transition-colors"
                  title="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Quick Add */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-sm btn-block bg-white text-black hover:bg-black hover:text-white border-none rounded-none uppercase tracking-widest font-bold shadow-lg"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-md font-bold uppercase truncate">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-1">{product.category || product.productType}</p>
                <p className="text-sm font-mono font-bold">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;