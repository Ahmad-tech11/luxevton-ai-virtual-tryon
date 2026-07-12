import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ light = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Bold Minimalist Monogram */}
      <motion.div
        className={`w-9 h-9 flex items-center justify-center transition-all duration-700 ease-out
          ${light ? 'bg-white text-black' : 'bg-gray-950 text-white group-hover:bg-luxury-gold dark:bg-white dark:text-gray-950'}`}
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2H10L14 12L18 2H22L14 22H10L2 2Z" />
        </svg>
      </motion.div>

      {/* Stark, High-Contrast Typography */}
      <div className="flex flex-col justify-center translate-y-[2px]">
        <span className={`text-[26px] font-serif font-bold tracking-tight leading-none transition-colors duration-500
          ${light ? 'text-white' : 'text-gray-950 dark:text-white'}`}>
          LUXE VTON
        </span>
      </div>
    </div>
  );
};

export default Logo;
