import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/productService';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist as addToWishlistService } from '../../services/wishlistService';
import { addToCart } from '../../context/cartSlice';
import { addItemToWishlist } from '../../context/wishlistSlice';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
    // Get current wishlist items from Redux to check if a product is already liked
    const wishlistItems = useSelector((state) => state.wishlist.items);

    // Load products when page opens
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle Adding to Cart
    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        // Optional: alert(`${product.name} added to cart!`); 
    };

    // Handle Adding to Wishlist (New Feature)
    const handleToggleWishlist = async (product) => {
        // Check if already in wishlist
        const exists = wishlistItems.find(item => item.id === product.id);
        
        if (exists) {
            alert("This item is already in your wishlist!"); 
            return; 
        }

        try {
            // 1. Add to Backend (Mock Service)
            await addToWishlistService(product);
            
            // 2. Add to Redux (Update UI immediately)
            dispatch(addItemToWishlist(product));
            
        } catch (error) {
            console.error("Failed to add to wishlist", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-2">Shop Skincare</h1>
                <p className="text-gray-500">Science-backed formulas for every skin type.</p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">

                        {/* Image Section */}
                        <figure className="h-64 relative">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />

                            {/* --- WISHLIST HEART BUTTON (NEW) --- */}
                            <button 
                                className="btn btn-circle btn-sm absolute top-2 left-2 bg-white border-none shadow-sm hover:bg-pink-50"
                                onClick={() => handleToggleWishlist(product)}
                                title="Add to Wishlist"
                            >
                                {/* Logic: If item is in wishlist, show Red Heart, else White Heart */}
                                {wishlistItems.find(item => item.id === product.id) ? '❤️' : '🤍'}
                            </button>

                            {/* Status Badge */}
                            {product.product_status === 'OUT_OF_STOCK' && (
                                <div className="absolute top-2 right-2 badge badge-error text-white">
                                    Out of Stock
                                </div>
                            )}
                        </figure>

                        {/* Content Section */}
                        <div className="card-body p-5">

                            {/* Category & Skin Type */}
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                <span>{product.product_type}</span>
                                <span className="text-secondary">{product.skin_type} Skin</span>
                            </div>

                            <h2 className="card-title text-lg">{product.name}</h2>
                            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

                            <div className="divider my-2"></div>

                            <div className="card-actions justify-between items-center">
                                <span className="text-xl font-bold text-primary">₹{product.price}</span>

                                {/* Add to Cart Button */}
                                <button
                                    className="btn btn-sm btn-primary"
                                    disabled={product.product_status === 'OUT_OF_STOCK'}
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;