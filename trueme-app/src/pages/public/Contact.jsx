import React from 'react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-black">
            <div className="max-w-4xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Contact Us</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We'd love to hear from you. Whether you have a question about our products, orders, or just want to say hello, our team is ready to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Email Section */}
                    <div className="bg-gray-50 p-10 border border-gray-100 text-center hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-6">✉️</div>
                        <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Email Us</h3>
                        <p className="text-gray-500 mb-6">For general inquiries and support</p>
                        <a href="mailto:support@trueme.com" className="text-2xl font-black hover:underline">
                            support@trueme.com
                        </a>
                    </div>

                    {/* Phone Section */}
                    <div className="bg-gray-50 p-10 border border-gray-100 text-center hover:shadow-lg transition-shadow">
                        <div className="text-4xl mb-6">📞</div>
                        <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Call Us</h3>
                        <p className="text-gray-500 mb-6">Mon-Fri from 9am to 6pm</p>
                        <a href="tel:+919876543210" className="text-2xl font-black hover:underline">
                            +91 98765 43210
                        </a>
                    </div>
                </div>

                <div className="mt-20 text-center border-t border-gray-200 pt-12">
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-4">Visit Our Store</h3>
                    <p className="text-gray-600">
                        123 Skincare Avenue, Wellness District<br />
                        Mumbai, Maharashtra 400001
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
