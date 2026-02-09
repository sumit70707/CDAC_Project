import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getProductById } from '../../services/productService';
import { addToCartServer } from '../../context/cartSlice';
import { addToWishlist, getWishlist, removeFromWishlist } from '../../services/wishlistService';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [error, setError] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                setError("Product not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Check Wishlist Status
    useEffect(() => {
        if (user && product) {
            checkWishlist();
        }
    }, [user, product]);

    const checkWishlist = async () => {
        try {
            const list = await getWishlist(user.id);
            // list items have { id: wishlistId, ...product } because of our previous service fix
            // Wait, previous service fix returns: list.map(item => ({ ...item.product, wishlistId: item.id }))
            // So 'item.id' is product id.
            const found = list.find(item => item.id == id);
            setIsWishlisted(!!found);
        } catch (err) {
            console.error(err);
        }
    };

    const handleWishlist = async () => {
        if (!user) {
            toast.error("Please login to manage wishlist");
            return;
        }

        try {
            if (isWishlisted) {
                await removeFromWishlist(user.id, id);
                setIsWishlisted(false);
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist(user.id, id);
                setIsWishlisted(true);
                toast.success("Added to wishlist ♥");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update wishlist");
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        dispatch(addToCartServer({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: qty
        }));

        toast.success(`${product.name} added to cart!`);
        navigate('/cart');
    };

    if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error || !product) return <div className="min-h-[50vh] flex items-center justify-center text-error font-bold">{error || "Product not found"}</div>;

    const isOutOfStock = product.status === 'OUT_OF_STOCK';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

            {/* --- LEFT: IMAGE --- */}
            <div className="bg-gray-100 aspect-square relative overflow-hidden group">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">No Image</div>
                )}

                {/* Wishlist Button (Overlay) */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-4 right-4 p-3 bg-white hover:bg-white/80 rounded-full shadow-lg transition-transform hover:scale-110 z-20"
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transition-colors duration-300 ${isWishlisted ? 'fill-black text-black' : 'fill-none text-gray-500'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={isWishlisted ? "0" : "1.5"}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* --- RIGHT: INFO --- */}
            <div className="flex flex-col justify-center">
                <div className="mb-2 flex gap-2 flex-wrap">
                    <span className="badge badge-neutral rounded-none uppercase text-[10px] tracking-wider">{product.productType}</span>
                    <span className="badge badge-outline rounded-none uppercase text-[10px] tracking-wider">{product.skinType} Skin</span>
                    {product.status === 'AVAILABLE' && (
                        <span className="badge bg-green-600 text-white rounded-none uppercase text-[10px] tracking-wider">✓ In Stock</span>
                    )}
                </div>

                <h1 className="text-4xl font-serif italic font-bold mb-4">{product.name}</h1>
                <p className="text-2xl font-medium mb-2">₹ {product.price}</p>

                {/* Stock Info */}
                {product.quantity !== undefined && (
                    <p className="text-sm text-gray-500 mb-6">
                        {product.quantity > 0 ? (
                            <span className="text-green-600 font-bold">{product.quantity} units available</span>
                        ) : (
                            <span className="text-red-600 font-bold">Out of stock</span>
                        )}
                    </p>
                )}

                <div className="prose mb-8">
                    <p>{product.description || "Experience the true essence of skincare with this meticulously crafted formula."}</p>
                </div>

                {/* pH Scale Visualization - ENHANCED */}
                {product.productPhValue && (
                    <div className="mb-8 bg-gray-50 p-6 border border-gray-200">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">pH Balanced Formula</h3>
                        <div className="flex justify-between text-[10px] uppercase font-bold mb-2 text-gray-500">
                            <span>Acidic</span>
                            <span>Neutral</span>
                            <span>Alkaline</span>
                        </div>
                        <div className="w-full h-3 bg-gradient-to-r from-red-400 via-green-400 to-blue-400 rounded-full relative mb-2">
                            <div
                                className="absolute top-0 bottom-0 w-5 h-5 bg-black rounded-full -mt-1 border-2 border-white shadow-lg"
                                style={{ left: `${(product.productPhValue / 14) * 100}%`, transform: 'translateX(-50%)' }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                            <span>0</span>
                            <span>7</span>
                            <span>14</span>
                        </div>
                        <p className="text-center text-lg font-black mt-3">pH {product.productPhValue}</p>
                        <p className="text-center text-xs text-gray-500 mt-1">Perfectly balanced for your skin's natural barrier</p>
                    </div>
                )}


                {/* Actions */}
                <div className="flex gap-4 mb-4">
                    <div className="join border border-black rounded-none">
                        <button className="join-item btn btn-sm btn-ghost rounded-none px-2" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                        <input className="join-item input input-sm w-12 text-center focus:outline-none rounded-none" value={qty} readOnly />
                        <button className="join-item btn btn-sm btn-ghost rounded-none px-2" onClick={() => setQty(qty + 1)}>+</button>
                    </div>
                    <button
                        className="btn btn-neutral flex-1 rounded-none uppercase tracking-widest"
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                    </button>
                </div>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>✓ Free shipping on orders above ₹499</p>
                    <p>✓ Science-backed formulation</p>
                    <p>✓ Dermatologically tested</p>
                </div>

            </div>

        </div>
    );
};

export default ProductDetails;
