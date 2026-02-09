// Mock Data for Blog Posts
// Enhanced Mock Data for Blog Posts - Skincare Education
const BLOG_POSTS = [
    {
        id: 1,
        title: "The Ultimate Guide to pH Balanced Skincare",
        excerpt: "Understanding your skin's pH is the first step to healthy, glowing skin. Learn why pH 5.5 matters and how to maintain it.",
        content: `
            <div class="prose max-w-none">
                <p class="text-lg leading-relaxed mb-6">Your skin's acid mantle is its first line of defense against environmental damage, bacteria, and moisture loss. Maintaining the optimal pH of around 5.5 is crucial for healthy, radiant skin.</p>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">What is the Acid Mantle?</h3>
                <p class="mb-4">The acid mantle is a fine, slightly acidic film on the surface of your skin. This invisible barrier acts as your skin's natural defense system, protecting against:</p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Harmful bacteria and viruses</li>
                    <li>Environmental pollutants</li>
                    <li>Moisture loss and dehydration</li>
                    <li>Premature aging</li>
                </ul>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">Why pH 5.5 is the Magic Number</h3>
                <p class="mb-4">Healthy skin has a pH level of approximately 5.5 - slightly acidic. This acidity is essential because:</p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Enzyme Activity:</strong> Skin enzymes function optimally at pH 5.5</li>
                    <li><strong>Barrier Function:</strong> The lipid barrier is maintained when pH is balanced</li>
                    <li><strong>Microbiome Health:</strong> Beneficial bacteria thrive in slightly acidic conditions</li>
                </ul>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">Signs Your pH is Imbalanced</h3>
                <p class="mb-4">When your skin's pH moves above 6 (too alkaline), you might experience:</p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Increased dryness and sensitivity</li>
                    <li>More frequent breakouts</li>
                    <li>Visible redness and inflammation</li>
                    <li>Accelerated signs of aging</li>
                </ul>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">How to Maintain pH Balance</h3>
                <div class="space-y-4 mb-6">
                    <div><strong class="text-black">1. Use pH-balanced cleansers:</strong> Avoid harsh soaps (pH 9-10). Choose gentle, pH-balanced cleansers around 5.5.</div>
                    <div><strong class="text-black">2. Incorporate toners:</strong> A good toner restores pH after cleansing.</div>
                    <div><strong class="text-black">3. Choose the right ingredients:</strong> Look for products with AHAs, BHAs, and vitamin C.</div>
                    <div><strong class="text-black">4. Avoid over-exfoliation:</strong> Too much exfoliation disrupts the acid mantle.</div>
                </div>
            </div>
        `,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
        author: "Dr. Sarah Skin",
        date: "Jan 15, 2026",
        category: "Science",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Morning vs. Night: Your Routine Demystified",
        excerpt: "Different time of day, different skincare needs. Build the perfect AM and PM routines for maximum results.",
        content: `
            <div class="prose max-w-none">
                <p class="text-lg leading-relaxed mb-6">Your skin has different needs depending on the time of day. In the morning, focus on protection. At night, prioritize repair and renewal.</p>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">☀️ The Perfect Morning Routine</h3>
                <p class="mb-4">Your AM routine should prepare and protect your skin for the day ahead.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">Step 1: Gentle Cleanser</h4>
                <p class="mb-4">Start with a mild, pH-balanced cleanser to remove overnight oils without stripping your skin.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">Step 2: Vitamin C Serum</h4>
                <p class="mb-4">Vitamin C is your morning superhero. It:</p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Brightens and evens skin tone</li>
                    <li>Provides antioxidant protection</li>
                    <li>Boosts collagen production</li>
                    <li>Enhances sun protection</li>
                </ul>
                
                <h4 class="text-xl font-bold mt-6 mb-3">Step 3: Lightweight Moisturizer</h4>
                <p class="mb-4">Choose a hydrating but non-greasy formula that layers well under makeup and sunscreen.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">Step 4: Broad-Spectrum SPF 30+</h4>
                <p class="mb-4"><strong class="bg-yellow-200 px-2 py-1">This is non-negotiable.</strong> UV damage is the #1 cause of premature aging.</p>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">🌙 The Perfect Evening Routine</h3>
                <p class="mb-4">Your PM routine focuses on deep cleansing, treatment, and overnight repair.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">Step 1: Double Cleanse</h4>
                <p class="mb-4">Start with an oil-based cleanser to remove makeup and SPF, followed by a water-based cleanser.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">Step 2: Treatment Serums</h4>
                <p class="mb-4">This is your time for active ingredients:</p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Retinol:</strong> For anti-aging and acne</li>
                    <li><strong>Niacinamide:</strong> For pore refinement</li>
                    <li><strong>Hyaluronic Acid:</strong> For deep hydration</li>
                </ul>
                
                <h4 class="text-xl font-bold mt-6 mb-3">Step 3: Rich Night Cream</h4>
                <p class="mb-4">Choose a thicker moisturizer. Your skin repairs itself overnight, so give it the nourishment it needs.</p>
                
                <div class="bg-gray-100 p-6 mt-8 rounded-lg">
                    <h4 class="font-bold mb-3">Pro Tips</h4>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Never use retinol in the morning</li>
                        <li>Apply skincare on damp skin for better absorption</li>
                        <li>Wait 1-2 minutes between each step</li>
                        <li>Consistency beats expensive products</li>
                    </ul>
                </div>
            </div>
        `,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
        author: "TrueMe Skincare Team",
        date: "Jan 22, 2026",
        category: "Routine",
        readTime: "7 min read"
    },
    {
        id: 3,
        title: "Decoding Ingredient Labels Like a Pro",
        excerpt: "Stop being intimidated by scientific names. Learn to read ingredient lists and identify what your skin truly needs.",
        content: `
            <div class="prose max-w-none">
                <p class="text-lg leading-relaxed mb-6">Ingredient lists can look like chemistry homework, but understanding them is the key to making informed skincare choices.</p>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">The Rules of Ingredient Listing</h3>
                <p class="mb-4"><strong>Order Matters:</strong> Ingredients are listed in descending order of concentration. The first 5-7 ingredients make up about 80% of the product.</p>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">🚩 Ingredients to Watch For</h3>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Alcohol Denat:</strong> Can be drying in high concentrations</li>
                    <li><strong>Sulfates (SLS, SLES):</strong> Harsh cleansing agents</li>
                    <li><strong>Synthetic Fragrances:</strong> Can cause sensitivity</li>
                    <li><strong>Essential Oils:</strong> Natural doesn't mean gentle</li>
                </ul>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">✨ Hero Ingredients to Look For</h3>
                
                <h4 class="text-xl font-bold mt-6 mb-3">For Hydration</h4>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Hyaluronic Acid:</strong> Holds 1000x its weight in water</li>
                    <li><strong>Glycerin:</strong> Powerful humectant</li>
                    <li><strong>Ceramides:</strong> Restore skin barrier</li>
                    <li><strong>Squalane:</strong> Lightweight hydrator</li>
                </ul>
                
                <h4 class="text-xl font-bold mt-6 mb-3">For Anti-Aging</h4>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Retinol:</strong> Gold standard for wrinkles</li>
                    <li><strong>Vitamin C:</strong> Brightens and protects</li>
                    <li><strong>Peptides:</strong> Signal collagen production</li>
                    <li><strong>Niacinamide:</strong> Improves texture and pores</li>
                </ul>
                
                <h4 class="text-xl font-bold mt-6 mb-3">For Acne-Prone Skin</h4>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Salicylic Acid:</strong> Penetrates pores</li>
                    <li><strong>Benzoyl Peroxide:</strong> Kills bacteria</li>
                    <li><strong>Azelaic Acid:</strong> Reduces inflammation</li>
                    <li><strong>Niacinamide:</strong> Regulates oil</li>
                </ul>
                
                <div class="bg-blue-50 p-6 mt-8 rounded-lg">
                    <h4 class="font-bold mb-3">The TrueMe Difference</h4>
                    <p class="mb-2">At TrueMe, we believe in radical transparency. Every product shows:</p>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Complete ingredient list</li>
                        <li>pH value for optimal compatibility</li>
                        <li>Skin type recommendations</li>
                        <li>Clear labeling of sensitizers</li>
                    </ul>
                </div>
            </div>
        `,
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=1200&q=80",
        author: "Lab Geek",
        date: "Jan 29, 2026",
        category: "Education",
        readTime: "8 min read"
    },
    {
        id: 4,
        title: "Find Your Skin Type: A Complete Guide",
        excerpt: "Normal, Oily, Dry, Combination, or Sensitive? Understanding your skin type is the foundation of effective skincare.",
        content: `
            <div class="prose max-w-none">
                <p class="text-lg leading-relaxed mb-6">Choosing skincare without knowing your skin type is like cooking without knowing your ingredients. Let's identify yours!</p>
                
                <h3 class="text-2xl font-bold mt-8 mb-4">The 5 Skin Types Explained</h3>
                
                <h4 class="text-xl font-bold mt-6 mb-3">1. Normal Skin ✨</h4>
                <p class="mb-2"><strong>Characteristics:</strong></p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Balanced oil and moisture</li>
                    <li>Small, barely visible pores</li>
                    <li>Few imperfections</li>
                    <li>Healthy, radiant complexion</li>
                </ul>
                <p class="mb-4"><strong>TrueMe Tip:</strong> Focus on prevention with SPF and gentle antioxidants.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">2. Oily Skin 💧</h4>
                <p class="mb-2"><strong>Characteristics:</strong></p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Shiny, greasy appearance</li>
                    <li>Enlarged pores</li>
                    <li>Prone to acne</li>
                    <li>Makeup tends to slide off</li>
                </ul>
                <p class="mb-4"><strong>Common Mistake:</strong> Over-cleansing triggers MORE oil production.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">3. Dry Skin 🍂</h4>
                <p class="mb-2"><strong>Characteristics:</strong></p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Rough, flaky texture</li>
                    <li>Tight feeling after cleansing</li>
                    <li>More visible fine lines</li>
                    <li>Minimal pores</li>
                </ul>
                <p class="mb-4"><strong>Key Strategy:</strong> Layer hydration - toner, serum, rich moisturizer, seal with oil.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">4. Combination Skin 🔄</h4>
                <p class="mb-2"><strong>Characteristics:</strong></p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Oily T-zone</li>
                    <li>Normal to dry cheeks</li>
                    <li>Most common skin type!</li>
                </ul>
                <p class="mb-4"><strong>Best Approach:</strong> Multi-masking - different products for different zones.</p>
                
                <h4 class="text-xl font-bold mt-6 mb-3">5. Sensitive Skin 🌸</h4>
                <p class="mb-2"><strong>Characteristics:</strong></p>
                <ul class="list-disc pl-6 mb-6 space-y-2">
                    <li>Easily irritated</li>
                    <li>Prone to redness</li>
                    <li>May burn or itch</li>
                    <li>Reacts to fragrances</li>
                </ul>
                <p class="mb-4"><strong>TrueMe Tip:</strong> Less is more - minimal routine with fragrance-free products.</p>
                
                <div class="bg-purple-50 p-6 mt-8 rounded-lg">
                    <h4 class="font-bold mb-3">🧪 The At-Home Skin Type Test</h4>
                    <ol class="list-decimal pl-6 space-y-2">
                        <li>Wash face with gentle cleanser and pat dry</li>
                        <li>Wait 30 minutes without applying any products</li>
                        <li>Examine in mirror:
                            <ul class="list-disc pl-6 mt-2 space-y-1">
                                <li>Shiny all over? → Oily</li>
                                <li>Tight or flaky? → Dry</li>
                                <li>Shiny T-zone? → Combination</li>
                                <li>Comfortable? → Normal</li>
                                <li>Red or irritated? → Sensitive</li>
                            </ul>
                        </li>
                    </ol>
                </div>
                
                <p class="mt-8 font-bold text-lg">Important: Skin type can change with age, climate, hormones, and seasons. Reassess every few months!</p>
            </div>
        `,
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
        author: "TrueMe Skincare Team",
        date: "Feb 02, 2026",
        category: "Guide",
        readTime: "6 min read"
    }
];

export const getAllPosts = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(BLOG_POSTS), 500);
    });
};

export const getPostById = async (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const post = BLOG_POSTS.find(p => p.id === parseInt(id));
            if (post) resolve(post);
            else reject("Post not found");
        }, 500);
    });
};
