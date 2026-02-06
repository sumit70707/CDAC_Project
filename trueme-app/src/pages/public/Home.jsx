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

      {/* --- HERO SECTION (IMPROVISED) --- */}
      <div className="relative h-[700px] flex items-center mb-0 overflow-hidden group">
        {/* Main Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1920&q=80")`,
          }}
        ></div>

        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-20 text-left text-white max-w-4xl ml-12 md:ml-24">
          <div className="overflow-hidden">
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-2 animate-slide-up">
              TrueMe
            </h1>
          </div>
          <div className="w-24 h-1 bg-white mb-8"></div>

          <div className="space-y-4 max-w-xl">
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.4em] uppercase opacity-90">
              Your Skin, Truly You
            </h2>
            <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed border-l-4 border-white pl-6">
              Science-backed formulations that honor your skin's natural pH balance.
              Premium ingredients. <span className="font-bold text-white">Zero compromises.</span>
            </p>
          </div>

          <div className="mt-12 flex gap-4">
            <Link
              to="/shop"
              className="inline-block bg-white text-black px-12 py-5 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all duration-300 border-2 border-white shadow-2xl active:scale-95"
            >
              Shop Collection
            </Link>
            <Link
              to="/about"
              className="inline-block bg-transparent text-white px-12 py-5 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all duration-300 border-2 border-white/50 backdrop-blur-sm"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Floating Accent Line */}
        <div className="absolute bottom-12 right-12 text-white/30 text-[10px] uppercase tracking-[1em] font-black vertical-text hidden lg:block">
          Est. 2024 • Pure Science
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

      {/* --- SHOP BY CONCERN (REPLACED & IMPROVISED) --- */}
      <div className="bg-white py-12 border-b border-black">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white py-3 px-6 mb-8 flex justify-between items-center group cursor-default">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Shop by Concern</h2>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest opacity-80">
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Shop by Category</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">All Products</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Combo Kits</span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">Track Order</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Oily Skin', slug: 'oily', img: 'https://images.unsplash.com/photo-1596755389378-c31d2115167e?auto=format&fit=crop&w=800' },
              { name: 'Dry Skin', slug: 'dry', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800' },
              { name: 'Sensitive Skin', slug: 'sensitive', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800' },
              { name: 'Normal Skin', slug: 'normal', img: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=800' },
            ].map((item, idx) => (
              <Link
                to={`/shop?concern=${item.slug}`}
                key={idx}
                className="group relative flex flex-col items-center overflow-hidden bg-gray-50 hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                {/* Black Bar Label */}
                <div className="w-full bg-black py-4 px-6 flex justify-between items-center group-hover:bg-gray-900 transition-colors">
                  <span className="text-xs font-black text-white uppercase tracking-widest truncate">
                    {item.name}
                  </span>
                  <span className="text-white text-xs font-bold transform translate-x-0 group-hover:translate-x-1 transition-transform">
                    &raquo;
                  </span>
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

      {/* --- CONTACT SECTION (Under About/Philosophy) --- */}
      <div id="contact" className="py-24 bg-white border-y border-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Support & Feedback</h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs mb-12 font-bold">Get in touch with us</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto font-sans">
            <div className="p-10 border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="text-3xl mb-4">✉️</div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Email</h4>
              <a href="mailto:support@trueme.com" className="text-xl font-bold hover:underline">support@trueme.com</a>
            </div>
            <div className="p-10 border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="text-3xl mb-4">📞</div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Phone</h4>
              <a href="tel:+919876543210" className="text-xl font-bold hover:underline">+91 98765 43210</a>
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
              className="inline-block bg-white text-black px-12 py-4 font-bold rounded-lg uppercase tracking-widest text-sm hover:bg-gray-200 transition-all shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="inline-block border-2 border-white text-white px-12 py-4 font-bold rounded-lg uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all shadow-lg"
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