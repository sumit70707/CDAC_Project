import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Fetch products and just take the first 4 for the homepage
    const loadData = async () => {
      const data = await getAllProducts();
      setFeaturedProducts(data.slice(0, 4));
    };
    loadData();
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <div className="hero min-h-[500px] bg-base-100 rounded-box overflow-hidden shadow-sm mb-16">
        <div className="hero-content flex-col lg:flex-row-reverse p-0 gap-0 w-full max-w-none">
          
          {/* Right Side: Image */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1556228720-1987594a8b44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              className="w-full h-full object-cover"
              alt="Skincare Bottle"
            />
          </div>

          {/* Left Side: Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-base-100">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              Pure Skin, <br/> 
              <span className="text-primary">True You.</span>
            </h1>
            <p className="py-6 text-gray-600 text-lg">
              Science-backed skincare for every skin type. No jargon, just results. 
              Discover the minimalist routine that actually works.
            </p>
            <div className="flex gap-4">
              <Link to="/shop" className="btn btn-primary px-8">Shop Now</Link>
              <Link to="/about" className="btn btn-outline px-8">Our Story</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEATURES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        <div className="text-center p-6 border border-base-200 rounded-xl hover:shadow-lg transition">
          <div className="text-4xl mb-4">🌿</div>
          <h3 className="text-xl font-bold mb-2">100% Vegan</h3>
          <p className="text-gray-500">No animal ingredients, ever. Just pure plant power.</p>
        </div>
        <div className="text-center p-6 border border-base-200 rounded-xl hover:shadow-lg transition">
          <div className="text-4xl mb-4">🔬</div>
          <h3 className="text-xl font-bold mb-2">Dermatologist Tested</h3>
          <p className="text-gray-500">Safe for sensitive skin and proven to deliver results.</p>
        </div>
        <div className="text-center p-6 border border-base-200 rounded-xl hover:shadow-lg transition">
          <div className="text-4xl mb-4">🐰</div>
          <h3 className="text-xl font-bold mb-2">Cruelty Free</h3>
          <p className="text-gray-500">We love animals. We never test on them.</p>
        </div>
      </div>

      {/* 3. FEATURED PRODUCTS */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <p className="text-gray-500 mt-2">Our most loved formulas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} to="/shop" className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300">
              <figure className="h-48">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-base">{product.name}</h3>
                <p className="text-primary font-bold">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
           <Link to="/shop" className="btn btn-wide btn-outline">View All Products</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;