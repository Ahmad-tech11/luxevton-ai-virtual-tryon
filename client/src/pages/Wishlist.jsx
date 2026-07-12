import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/categories';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="container-luxe py-12 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-4xl font-serif font-medium dark:text-white">Your Wishlist</h1>
          <p className="text-gray-500 tracking-wider uppercase mt-2 text-sm">{wishlistItems.length} items saved</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Heart size={48} className="text-gray-300 dark:text-gray-700" />
          <p className="text-gray-500 text-lg">Your wishlist is currently empty.</p>
          <Link to="/products" className="btn-primary mt-4">Explore Collections</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {wishlistItems.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.productId}
              className="group"
            >
              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[3/4]">
                <Link to={`/product/${item.productId}`}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => addToCart({ ...item, _id: item.productId }, 1, 'M', '', item.image)}
                    className="w-full bg-black dark:bg-white text-white dark:text-black text-xs font-medium tracking-wider uppercase py-2.5 flex items-center justify-center gap-1.5 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                </div>
              </div>

              <div className="pt-3 space-y-1">
                <p className="text-[11px] text-gray-400 tracking-wider uppercase">{item.category?.replace(/-/g, ' ')}</p>
                <Link to={`/product/${item.productId}`}>
                  <h3 className="text-sm font-medium truncate hover:text-luxury-gold transition-colors dark:text-gray-200">{item.title}</h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold dark:text-gray-100">{formatPrice(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
