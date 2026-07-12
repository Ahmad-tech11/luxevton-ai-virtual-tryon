import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const RecentlyViewedContext = createContext();
export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

const RV_KEY = 'luxevton_recently_viewed';
const MAX = 8;

const load = () => { try { return JSON.parse(localStorage.getItem(RV_KEY)) || []; } catch { return []; } };
const save = (items) => localStorage.setItem(RV_KEY, JSON.stringify(items));

export const RecentlyViewedProvider = ({ children }) => {
  const [recentItems, setRecentItems] = useState(load);
  useEffect(() => { save(recentItems); }, [recentItems]);

  const addToRecentlyViewed = useCallback((product) => {
    const id = product._id || product.id;
    setRecentItems(prev => {
      const filtered = prev.filter(i => i.productId !== id);
      return [{
        productId: id,
        title: product.title,
        images: product.images || [],
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        gender: product.gender,
        viewedAt: Date.now(),
      }, ...filtered].slice(0, MAX);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentItems([]);
    localStorage.removeItem(RV_KEY);
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentItems, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
