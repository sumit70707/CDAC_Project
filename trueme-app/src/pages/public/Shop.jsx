import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { filterProducts, getAllProducts } from '../../services/productService';
import { addToWishlist, getWishlist, removeFromWishlist } from '../../services/wishlistService';

const Shop = () => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlistIds, setWishlistIds] = useState([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10; // Backend default

    // Filter State
    const [filters, setFilters] = useState({
        skinType: '',
        productType: '',
        minPrice: '',
        maxPrice: '',
    });

    // Options
    const skinTypes = [
        { label: 'Normal', value: 'NORMAL' },
        { label: 'Oily', value: 'OILY' },
        { label: 'Dry', value: 'DRY' },
        { label: 'Combination', value: 'COMBINATION' },
        { label: 'Sensitive', value: 'SENSITIVE' }
    ];
    const productTypes = [
        { label: 'Facewash', value: 'FACEWASH' },
        { label: 'Cleanser', value: 'CLEANSER' },
        { label: 'Toner', value: 'TONER' },
        { label: 'Serum', value: 'SERUM' },
        { label: 'Moisturizer', value: 'MOISTURIZER' },
        { label: 'Sunscreen', value: 'SUNSCREEN' },
        { label: 'Mask', value: 'MASK' },
        { label: 'Other', value: 'OTHER' }
    ];

    // Load initial products (all or filtered by URL)
    useEffect(() => {
        // Parse URL params
        const queryParams = new URLSearchParams(location.search);
        const concern = queryParams.get('concern');

        if (concern) {
            // Map concern to relevant filters
            let type = '';
            let skin = '';

            switch (concern) {
                case 'oily':
                    skin = 'OILY';
                    break;
                case 'dry':
                    skin = 'DRY';
                    break;
                case 'sensitive':
                    skin = 'SENSITIVE';
                    break;
                case 'normal':
                    skin = 'NORMAL';
                    break;
                default:
                    break;
            }

            const newFilters = { ...filters, skinType: skin, productType: type };
            setFilters(newFilters);

            // Trigger filter immediately
            const params = {};
            if (skin) params.skinType = skin;
            if (type) params.productType = type;

            if (Object.keys(params).length > 0) {
                fetchFiltered(params);
            } else {
                loadProducts();
            }
        } else {
            loadProducts();
        }
    }, [location.search]);

    // Load Wishlist when user changes
    useEffect(() => {
        if (user) {
            fetchUserWishlist();
        } else {
            setWishlistIds([]);
        }
    }, [user]);

    const fetchUserWishlist = async () => {
        try {
            const list = await getWishlist(user.id);
            // list contains objects with 'id' being the product ID logic is tricky since service unwraps
            // Wait, service returns item.product (with id) and wishlistId.
            // So list is array of products.
            const ids = list.map(item => item.id);
            setWishlistIds(ids);
        } catch (err) {
            console.error("Failed to load wishlist", err);
        }
    }

    const fetchFiltered = async (params, page = 0) => {
        setLoading(true);
        try {
            const paginatedParams = { ...params, page, size: pageSize };
            const data = await filterProducts(paginatedParams);

            // Handle paginated response
            if (data.content) {
                setProducts(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
                setCurrentPage(page);
            } else {
                setProducts(data || []);
            }
        } catch (err) {
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async (page = 0) => {
        setLoading(true);
        try {
            const data = await getAllProducts({ page, size: pageSize });

            // Handle paginated response
            if (data.content) {
                setProducts(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
                setCurrentPage(page);
            } else {
                setProducts(data || []);
            }
        } catch (err) {
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Filter Apply
    const handleApplyFilters = async () => {
        // Reset to first page when filters change
        setCurrentPage(0);

        setLoading(true);
        try {
            // Build clean filter object (remove empty strings)
            const params = {};
            if (filters.skinType) params.skinType = filters.skinType;
            if (filters.productType) params.productType = filters.productType;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;

            // Call Filter API with pagination
            if (Object.keys(params).length === 0) {
                await loadProducts(0);
            } else {
                await fetchFiltered(params, 0);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to filter products.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFilters({ skinType: '', productType: '', minPrice: '', maxPrice: '' });
        setCurrentPage(0);
        loadProducts(0);
    };

    // Handle Page Change
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            // Check if we have active filters
            const params = {};
            if (filters.skinType) params.skinType = filters.skinType;
            if (filters.productType) params.productType = filters.productType;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;

            if (Object.keys(params).length > 0) {
                fetchFiltered(params, newPage);
            } else {
                loadProducts(newPage);
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleWishlist = async (e, productId) => {
        e.preventDefault(); // Prevent navigating to product page
        if (!user) {
            alert("Please login to manage wishlist");
            return;
        }

        const isInWishlist = wishlistIds.includes(productId);

        try {
            if (isInWishlist) {
                await removeFromWishlist(user.id, productId);
                setWishlistIds(prev => prev.filter(id => id !== productId));
            } else {
                await addToWishlist(user.id, productId);
                setWishlistIds(prev => [...prev, productId]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">

            {/* --- SIDEBAR FILTERS --- */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">Filters</h3>

                    {/* Skin Type */}
                    <div className="mb-6">
                        <h4 className="font-bold text-sm uppercase mb-3">Skin Type</h4>
                        <div className="space-y-2">
                            {skinTypes.map(type => (
                                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="skinType"
                                        className="radio radio-xs rounded-none checked:bg-black"
                                        checked={filters.skinType === type.value}
                                        onChange={() => setFilters({ ...filters, skinType: type.value })}
                                    />
                                    <span className="text-sm">{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Product Type */}
                    <div className="mb-6">
                        <h4 className="font-bold text-sm uppercase mb-3">Category</h4>
                        <select
                            className="select select-bordered w-full rounded-none select-sm focus:outline-none focus:border-black"
                            value={filters.productType}
                            onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            {productTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h4 className="font-bold text-sm uppercase mb-3">Price Range</h4>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Min"
                                className="input input-bordered input-sm w-1/2 rounded-none"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="input input-bordered input-sm w-1/2 rounded-none"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <button onClick={handleApplyFilters} className="btn btn-neutral btn-sm rounded-none uppercase w-full">Apply</button>
                        <button onClick={handleReset} className="btn btn-ghost btn-sm rounded-none uppercase w-full text-xs">Reset</button>
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-gray-500">{products.length} Products Found</span>
                    {/* Sort could go here */}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><span className="loading loading-dots loading-lg"></span></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className="group block">
                                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                                        {/* Image */}
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase font-bold">No Image</div>
                                        )}

                                        {/* Wishlist Button (Heart) */}
                                        <button
                                            onClick={(e) => handleWishlist(e, product.id)}
                                            className="absolute top-2 left-2 p-2 hover:scale-110 transition-transform z-10"
                                            title={wishlistIds.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-6 w-6 ${wishlistIds.includes(product.id) ? 'fill-black text-black' : 'fill-none text-gray-600 hover:text-black'}`}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={wishlistIds.includes(product.id) ? "0" : "1.5"}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>

                                        {/* Badges */}
                                        {product.status === 'OUT_OF_STOCK' && (
                                            <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Sold Out</div>
                                        )}

                                        {/* Quick Add Overlay (Optional) */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                                            <span className="text-xs font-bold uppercase tracking-widest">View Details</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold uppercase leading-none mb-1 group-hover:underline">{product.name}</h3>
                                        <p className="text-xs text-gray-500 mb-1">{product.skinType} Skin</p>
                                        <p className="text-md font-medium">₹ {product.price}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <h3 className="text-xl font-bold mb-2">No products found</h3>
                                <p className="text-gray-500">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-3">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 border border-black bg-white text-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Prev
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePageChange(idx)}
                                    className={`px-4 py-2 border font-bold text-xs transition-colors ${idx === currentPage
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-black hover:bg-black hover:text-white'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="px-4 py-2 border border-black bg-white text-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Shop;