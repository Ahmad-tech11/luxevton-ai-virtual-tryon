import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getDiscount } from '../data/categories';

const ProductCard = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const discount = getDiscount(product.price, product.originalPrice);
  const img1 = product.images?.[0] || product.image || '';
  const img2 = product.images?.[1] || product.image || img1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        <Link to={`/product/${product._id}`}>
          <img
            src={hovered ? img2 : img1}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 tracking-wider">-{discount}%</span>
          )}
          {product.featured && (
            <span className="bg-luxury-gold text-white text-[10px] font-bold px-2 py-1 tracking-wider">FEATURED</span>
          )}
          {product.isNewArrival && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 tracking-wider">NEW</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-gray-800"
        >
          <Heart size={16} fill={isInWishlist(product._id) ? '#C9A96E' : 'none'} color={isInWishlist(product._id) ? '#C9A96E' : '#000'} className="dark:text-white" />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addToCart(product, 1, product.sizes?.[1] || product.sizes?.[0] || 'M', product.colors?.[0]?.name || '', hovered ? img2 : img1)}
            className="flex-1 bg-black text-white text-xs font-medium tracking-wider uppercase py-2.5 flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag size={14} /> Add to Bag
          </button>
          <Link
            to={`/product/${product._id}`}
            className="w-10 bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 space-y-1">
        <p className="text-[11px] text-gray-400 tracking-wider uppercase">{product.category?.replace(/-/g, ' ')}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium truncate hover:text-luxury-gold transition-colors">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold dark:text-gray-100">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1 pt-1">
            {product.colors.slice(0, 4).map((c, i) => (
              <span key={i} className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ background: c.hex }} title={c.name} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
