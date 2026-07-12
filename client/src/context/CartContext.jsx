import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CART_KEY = 'luxevton_cart';

const loadCart = () => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => { saveCart(items); }, [items]);

  const addToCart = useCallback((product, quantity = 1, size = 'M', color = '', selectedImage = '') => {
    setItems(prev => {
      const key = `${product._id || product.id}-${size}-${color}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        toast.success('Updated quantity in cart');
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity, image: selectedImage || i.image } : i);
      }
      toast.success('Added to cart');
      return [...prev, {
        key,
        productId: product._id || product.id,
        title: product.title,
        image: selectedImage || product.images?.[0] || '',
        price: product.price,
        originalPrice: product.originalPrice,
        size,
        color,
        quantity,
      }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) return removeFromCart(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  }, []);

  const removeFromCart = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
    toast.success('Removed from cart');
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((t, i) => t + i.price * i.quantity, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((t, i) => t + i.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items, isCartOpen, setIsCartOpen,
      addToCart, updateQuantity, removeFromCart, clearCart,
      getCartTotal, getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
