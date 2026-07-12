import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { MENU_DATA } from '../data/categories';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="container-luxe py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-xl font-serif mb-1">Stay in Style</h3>
            <p className="text-sm text-gray-400">Subscribe for exclusive collections & offers</p>
          </div>
          <form className="flex w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="bg-gray-900 border border-gray-700 px-4 py-3 text-sm w-full md:w-72 focus:outline-none focus:border-luxury-gold" />
            <button className="bg-luxury-gold text-white px-6 py-3 text-sm font-medium tracking-wider uppercase hover:bg-yellow-700 transition-colors whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="container-luxe py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="inline-block mb-4">
            <Logo light={true} />
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">Premium Pakistani fashion with AI-powered virtual try-on technology.</p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-colors"><Instagram size={16} /></a>
            <a href="#" className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-colors"><Facebook size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Men</h4>
          <ul className="space-y-2">
            {MENU_DATA.men.categories.slice(0, 6).map(c => (
              <li key={c.slug}><Link to={`/products/men/${c.slug}`} className="text-sm hover:text-white transition-colors">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Women</h4>
          <ul className="space-y-2">
            {MENU_DATA.women.categories.slice(0, 6).map(c => (
              <li key={c.slug}><Link to={`/products/women/${c.slug}`} className="text-sm hover:text-white transition-colors">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm"><MapPin size={16} className="shrink-0 mt-0.5" /> Sahiwal, Pakistan</li>
            <li className="flex items-center gap-2 text-sm"><Phone size={16} className="shrink-0" /> 03106365720</li>
            <li className="flex items-center gap-2 text-sm"><Mail size={16} className="shrink-0" /> muhammadahmadch101@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="container-luxe py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} LUXE VTON. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;