import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllProducts } from '../../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchFeatured = async () => {
      // Backend requires authentication to view products
      // Skip if user not logged in
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getAllProducts({ page: 0, size: 8, sortBy: 'id', direction: 'desc' });
        setFeaturedProducts(data.content || data || []);
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [isAuthenticated]);

  return (
    <div className="bg-white font-sans">

      {/* --- HERO SECTION --- */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 h-[600px] flex items-center mb-0 overflow-hidden">
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="container mx-auto px-6 relative z-20 text-center text-white">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 animate-fade-in">
            TrueMe
          </h1>
          <div className="w-32 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl md:text-3xl font-light tracking-[0.3em] uppercase mb-6 opacity-90">
            Authentic Skincare
          </p>
          <p className="text-lg md:text-xl font-normal mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed">
            Science-backed formulations that honor your skin's natural pH balance.<br />
            Premium ingredients. Zero compromises.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-black px-12 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-all border-2 border-white"
          >
            Discover Collection
          </Link>
        </div>
      </div>

      {/* --- BRAND VALUES BANNER --- */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold mb-2">pH Balanced</h3>
              <p className="text-xs opacity-70">Formulated at skin's ideal pH 5.5</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold mb-2">Clean Ingredients</h3>
              <p className="text-xs opacity-70">No harsh chemicals or toxins</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold mb-2">Dermatologist Tested</h3>
              <p className="text-xs opacity-70">Clinically proven efficacy</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SHOP BY CONCERN --- */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Shop by Concern</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Find targeted solutions for your unique skin needs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: 'Acne Control',
                img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400',
                desc: 'Clear & balanced'
              },
              {
                name: 'Deep Hydration',
                img: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400',
                desc: 'Plump & moisturized'
              },
              {
                name: 'Radiant Glow',
                img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400',
                desc: 'Bright & luminous'
              },
              {
                name: 'Anti-Aging',
                img: 'https://images.unsplash.com/photo-1571781535009-536321e028e6?auto=format&fit=crop&w=400',
                desc: 'Firm & youthful'
              }
            ].map((item, idx) => (
              <Link to="/shop" key={idx} className="group relative overflow-hidden bg-white border border-gray-200 transition-all hover:shadow-2xl">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-sm font-black uppercase tracking-wide mb-2">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- FEATURED PRODUCTS --- */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">New Arrivals</h2>
            <p className="text-gray-600">Fresh formulations, just for you</p>
          </div>
          <Link to="/shop" className="text-sm font-bold uppercase tracking-widest underline hover:text-gray-600 transition-colors">
            View All Products
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {!isAuthenticated ? (
              <div className="col-span-4 text-center py-20 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Please Login to View Products</h3>
                <p className="text-gray-600 mb-6">Create an account or sign in to explore our collection</p>
                <div className="flex gap-4 justify-center">
                  <Link to="/login" className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition-all">
                    Login
                  </Link>
                  <Link to="/register" className="px-8 py-3 border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-all">
                    Register
                  </Link>
                </div>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="group block bg-white border border-gray-200 overflow-hidden transition-all hover:shadow-2xl"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        {product.productType}
                      </span>
                      <span className="text-xs font-mono font-bold">pH {product.productPhValue}</span>
                    </div>
                    <h3 className="font-bold uppercase tracking-wide text-sm mb-2 line-clamp-2 h-10">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-mono text-lg font-black">₹{product.price}</p>
                      {product.qty > 0 ? (
                        <span className="text-xs uppercase font-bold text-black">In Stock</span>
                      ) : (
                        <span className="text-xs uppercase font-bold text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-20 text-gray-400">
                <p className="text-lg uppercase tracking-widest">No products available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- OUR PHILOSOPHY --- */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">The TrueMe Promise</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed mb-12 font-light">
              "True beauty isn't about covering up; it's about revealing what's already there.
              At TrueMe, we craft formulations that respect your skin's natural balance.
              No harsh chemicals, no empty promises—just pure, effective care for the skin you're in."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-8 border-l-4 border-black">
                <h4 className="text-sm font-black uppercase tracking-widest mb-3">Pure Ingredients</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Every formula is free from parabens, sulfates, and artificial fragrances.
                </p>
              </div>
              <div className="bg-white p-8 border-l-4 border-black">
                <h4 className="text-sm font-black uppercase tracking-widest mb-3">pH Perfection</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All products maintain your skin's ideal pH of 5.5 for optimal barrier function.
                </p>
              </div>
              <div className="bg-white p-8 border-l-4 border-black">
                <h4 className="text-sm font-black uppercase tracking-widest mb-3">Proven Results</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Clinically tested and dermatologist-approved for all skin types.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA BANNER --- */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Ready to Reveal Your True Skin?</h2>
          <p className="text-lg mb-8 opacity-80">Join thousands who've discovered the TrueMe difference</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-block bg-white text-black px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="inline-block border-2 border-white text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;