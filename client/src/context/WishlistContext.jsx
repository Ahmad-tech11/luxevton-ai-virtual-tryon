import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

const WL_KEY = 'luxevton_wishlist';

const load = () => { try { return JSON.parse(localStorage.getItem(WL_KEY)) || []; } catch { return []; } };
const save = (items) => localStorage.setItem(WL_KEY, JSON.stringify(items));

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(load);
  useEffect(() => { save(wishlistItems); }, [wishlistItems]);

  const toggleWishlist = useCallback((product) => {
    const id = product._id || product.id;
    setWishlistItems(prev => {
      const exists = prev.find(i => i.productId === id);
      if (exists) {
        toast.success('Removed from wishlist');
        return prev.filter(i => i.productId !== id);
      }
      toast.success('Added to wishlist ❤️');
      return [...prev, {
        productId: id,
        title: product.title,
        image: product.images?.[0] || '',
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        gender: product.gender,
        addedAt: Date.now(),
      }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => prev.filter(i => i.productId !== productId));
    toast.success('Removed from wishlist');
  }, []);

  const isInWishlist = useCallback((productId) =>
    wishlistItems.some(i => i.productId === productId), [wishlistItems]);

  const getWishlistCount = useCallback(() => wishlistItems.length, [wishlistItems]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist, getWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
