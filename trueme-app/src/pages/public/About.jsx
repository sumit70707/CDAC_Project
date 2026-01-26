import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-base-100 min-h-screen">
      
      {/* Hero Section */}
      <div className="hero h-96 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Our Story</h1>
            <p className="py-6 text-gray-600">
              We started TrueMe with a simple mission: To make skincare transparent, scientific, and effective for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Why TrueMe?</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In a world full of complex chemicals and confusing labels, we wanted to bring clarity. 
              TrueMe is built on the philosophy that your skin deserves the truth. We partner directly 
              with dermatologists to curate products that are safe, vegan, and effective.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Whether you have dry, oily, or sensitive skin, we have a routine tailored just for you.
            </p>
            <div className="stats shadow w-full border border-gray-100">
              <div className="stat place-items-center">
                <div className="stat-title">Happy Customers</div>
                <div className="stat-value text-primary">50k+</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title">Products Sold</div>
                <div className="stat-value text-secondary">1.2M</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-2xl h-96">
            <img 
              src="https://images.unsplash.com/photo-1576426863848-c2185fc6e818?auto=format&fit=crop&w=800&q=80" 
              alt="Skincare Lab" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to find your glow?</h2>
        <Link to="/shop" className="btn btn-wide btn-white text-primary bg-white hover:bg-gray-100 border-none">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default About;