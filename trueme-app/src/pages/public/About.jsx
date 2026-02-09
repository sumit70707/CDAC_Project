import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans">

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000"
            alt="TrueMe Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-6 animate-fade-in">
            TrueMe
          </h1>
          <p className="text-2xl font-light tracking-wide opacity-90">
            Science-Backed Skincare. Radically Transparent.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 border-l-8 border-black pl-6">
              Our Mission
            </h2>
            <p className="text-xl leading-relaxed mb-6 text-gray-700">
              In a world of beauty marketing hype and empty promises, TrueMe stands for radical honesty. We believe you deserve to know exactly what you're putting on your skin—and why it matters.
            </p>
            <p className="text-xl leading-relaxed text-gray-700">
              Every product is formulated with pH balance in mind, selected for your specific skin type, and backed by real science—not influencer trends.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80"
              alt="Skincare Science"
              className="w-full h-[400px] object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-16 text-center">
            What Sets Us Apart
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Value 1 */}
            <div className="bg-white p-10 border-t-8 border-black hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-6">🔬</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">pH Balanced</h3>
              <p className="text-gray-600 leading-relaxed">
                Every single product displays its pH value. Your skin's natural pH is 5.5—why would you use products that disrupt it? We don't hide behind marketing speak.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-10 border-t-8 border-black hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-6">💎</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Full Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete ingredient lists. Concentration percentages. Skin type compatibility. No proprietary blends hiding what you need to know.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-10 border-t-8 border-black hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-6">🌿</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Personalized</h3>
              <p className="text-gray-600 leading-relaxed">
                Filter by your skin type: Normal, Oily, Dry, Combination, or Sensitive. Find products that actually work for YOU—not a one-size-fits-all approach.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
              alt="Skincare Lab"
              className="w-full h-[400px] object-cover shadow-2xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 border-l-8 border-black pl-6">
              Our Story
            </h2>
            <p className="text-xl leading-relaxed mb-6 text-gray-700">
              TrueMe was born from frustration. Frustration with skincare brands that hide behind buzzwords like "natural" and "clean" without explaining what they actually mean.
            </p>
            <p className="text-xl leading-relaxed mb-6 text-gray-700">
              We asked: What if a skincare brand respected your intelligence? What if instead of marketing tricks, we gave you real information to make informed choices?
            </p>
            <p className="text-xl leading-relaxed text-gray-700">
              TrueMe is that answer. A platform where science meets skincare, where sellers compete on transparency, and where you—the customer—have all the tools to find what truly works.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-black text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-16 text-center">
            How TrueMe Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Find Your Type</h3>
              <p className="text-gray-300 leading-relaxed">Identify your skin type using our guide or quiz.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Filter Smart</h3>
              <p className="text-gray-300 leading-relaxed">Use skin type, pH value, and product type filters.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Read Labels</h3>
              <p className="text-gray-300 leading-relaxed">See full ingredient lists and concentrations.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">4</div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Buy Confident</h3>
              <p className="text-gray-300 leading-relaxed">Purchase products you understand and trust.</p>
            </div>
          </div>
        </div>
      </div>



    </div>
  );
};

export default About;