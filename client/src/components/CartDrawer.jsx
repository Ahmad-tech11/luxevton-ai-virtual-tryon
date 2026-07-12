import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/categories';

// ⚠️ Replace with your actual WhatsApp number (include country code, no +, no spaces)
const WHATSAPP_NUMBER = '923106365720';

const buildWhatsAppMessage = (items, total) => {
  let msg = '🛍️ *New Order from Luxe VTON*\n\n';
  msg += '*Order Items:*\n';
  items.forEach((item, i) => {
    msg += `${i + 1}. ${item.title}\n`;
    msg += `   Size: ${item.size}${item.color ? ' | Color: ' + item.color : ''}\n`;
    msg += `   Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\n\n`;
  });
  msg += `─────────────────\n`;
  msg += `*Total: ${formatPrice(total)}*\n\n`;
  msg += `Please confirm my order. Thank you!`;
  return msg;
};

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage(items, getCartTotal());
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60]"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-serif font-semibold flex items-center gap-2 dark:text-white">
                <ShoppingBag size={20} /> Shopping Bag ({items.length})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:text-luxury-gold dark:text-gray-400 dark:hover:text-luxury-gold transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                <ShoppingBag size={48} className="text-gray-200 dark:text-gray-700" />
                <p className="text-gray-500 dark:text-gray-400">Your bag is empty</p>
                <Link to="/products" onClick={() => setIsCartOpen(false)} className="btn-primary text-sm">
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.key} className="flex gap-4 pb-4 border-b dark:border-gray-700 last:border-0">
                      <div className="w-20 h-24 bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate dark:text-gray-100">{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.size}{item.color ? ` / ${item.color}` : ''}
                        </p>
                        <p className="text-sm font-semibold mt-1 dark:text-gray-200">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border dark:border-gray-600">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm font-medium dark:text-gray-200">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.key)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t dark:border-gray-700 space-y-3 bg-white dark:bg-gray-900">
                  <div className="flex justify-between text-lg font-semibold dark:text-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Checkout
                  </Link>
                  {/* WhatsApp Order Button */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="btn-whatsapp w-full"
                  >
                    <MessageCircle size={18} />
                    Order via WhatsApp
                  </button>
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-outline w-full text-center text-xs"
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
