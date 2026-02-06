import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content mt-auto">
            <aside>
                <h2 className="text-3xl font-bold font-serif italic text-primary">TrueMe</h2>
                <p className="font-medium">
                    Embrace your true self.<br />
                    Premium skincare for the underrated you.
                </p>
                <p className="text-sm mt-2 opacity-75">
                    © {new Date().getFullYear()} TrueMe Skincare. All rights reserved.
                </p>
            </aside>
            <nav>
                <header className="footer-title">Services</header>
                <Link to="/shop" className="link link-hover">Shop</Link>
                <Link to="/about" className="link link-hover">About Us</Link>
                <Link to="/contact" className="link link-hover">Contact Us</Link>
                <Link to="/blog" className="link link-hover">Blog</Link>
            </nav>
            <nav>
                <header className="footer-title">Legal</header>
                <Link to="/terms" className="link link-hover">Terms of use</Link>
                <Link to="/privacy" className="link link-hover">Privacy policy</Link>
                <Link to="/cookie" className="link link-hover">Cookie policy</Link>
            </nav>
        </footer>
    );
};

export default Footer;
