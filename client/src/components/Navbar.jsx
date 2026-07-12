import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronDown, Heart, Sparkles, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { MENU_DATA } from '../data/categories';
import Logo from './Logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const { getCartCount, setIsCartOpen } = useCart();
  const { getWishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const megaRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setActiveMega(null); }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setActiveMega(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { key: 'men', label: 'Men', mega: true },
    { key: 'women', label: 'Women', mega: true },
    { key: 'kids', label: 'Kids', mega: true },
    { to: '/products', label: 'Collections' },
    { to: '/tryon', label: 'AI Try-On', icon: <Sparkles size={14} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="container-luxe">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/"><Logo /></Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8" ref={megaRef}>
            {navLinks.map((link) => (
              <div key={link.key || link.to} className="relative group">
                <div className="flex items-center gap-1 py-2 cursor-pointer transition-transform duration-300 hover:scale-110">
                  <Link
                    to={link.key ? `/products/${link.key}` : link.to}
                    className={`text-base font-semibold tracking-widest uppercase transition-colors dark:text-gray-200 ${
                      activeMega === link.key ? 'text-luxury-gold dark:text-luxury-gold' : 'hover:text-black dark:hover:text-white'
                    }`}
                    onClick={() => setActiveMega(null)}
                  >
                    {link.icon && <span className="inline-block mr-1 align-middle">{link.icon}</span>}
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black dark:bg-luxury-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                  {link.key && (
                    <button
                      onClick={() => setActiveMega(activeMega === link.key ? null : link.key)}
                      className="hover:text-luxury-gold outline-none dark:text-gray-300"
                    >
                      <ChevronDown size={18} className={`transition-transform ${activeMega === link.key ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Mega Menu */}
                {link.key && (
                  <AnimatePresence>
                    {activeMega === link.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                        onMouseLeave={() => setActiveMega(null)}
                      >
                        <div className="bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-8 min-w-[600px] grid grid-cols-2 gap-x-10 gap-y-2">
                          <div className="col-span-2 mb-4 pb-4 border-b dark:border-gray-700">
                            <Link
                              to={`/products/${link.key}`}
                              className="text-base font-bold tracking-widest uppercase hover:text-luxury-gold transition-colors text-gray-900 dark:text-gray-100"
                            >
                              View All {link.label} →
                            </Link>
                          </div>
                          {MENU_DATA[link.key]?.categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              to={`/products/${link.key}/${cat.slug}`}
                              className="text-base text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:pl-2 transition-all py-1.5"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 dark:text-gray-200"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 dark:text-gray-200"
              aria-label="Wishlist"
              title="My Wishlist"
            >
              <Heart size={20} className={getWishlistCount() > 0 ? 'fill-red-500 text-red-500' : ''} />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 dark:text-gray-200"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black dark:bg-luxury-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 overflow-hidden"
          >
            <div className="container-luxe py-6 space-y-1">
              {navLinks.map((link) => (
                link.mega ? (
                  <MobileAccordion key={link.key} link={link} />
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 text-sm font-medium tracking-wider uppercase py-3 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
                  >
                    {link.icon}{link.label}
                  </Link>
                )
              ))}
              <Link
                to="/wishlist"
                className="flex items-center gap-2 text-sm font-medium tracking-wider uppercase py-3 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
              >
                <Heart size={16} className={getWishlistCount() > 0 ? 'text-red-500 fill-red-500' : ''} />
                Wishlist {getWishlistCount() > 0 && `(${getWishlistCount()})`}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MobileAccordion = ({ link }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium tracking-wider uppercase py-3 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
      >
        {link.label}
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden pl-4"
          >
            <Link to={`/products/${link.key}`} className="block text-sm text-luxury-gold py-2 hover:underline">View All {link.label} →</Link>
            {MENU_DATA[link.key]?.categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products/${link.key}/${cat.slug}`}
                className="block text-sm text-gray-600 dark:text-gray-400 py-2 hover:text-black dark:hover:text-white transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
