import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/categories';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-luxe py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-3xl font-serif mb-2">Your Bag is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-8">
      <h1 className="text-3xl font-serif font-medium mb-8">Shopping Bag</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-4 pb-6 border-b">
              <Link to={`/product/${item.productId}`} className="w-28 h-36 bg-gray-100 shrink-0 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <Link to={`/product/${item.productId}`} className="font-medium hover:text-luxury-gold transition-colors">{item.title}</Link>
                    <p className="text-sm text-gray-500 mt-0.5">Size: {item.size}{item.color ? ` | Color: ${item.color}` : ''}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.key)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={18} /></button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="p-2 hover:bg-gray-100"><Minus size={14} /></button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="p-2 hover:bg-gray-100"><Plus size={14} /></button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-500">{formatPrice(item.price)} each</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="flex justify-between pt-2">
            <Link to="/products" className="text-sm text-gray-600 hover:text-black flex items-center gap-1">← Continue Shopping</Link>
            <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-gray-50 p-6 space-y-4 sticky top-24">
            <h3 className="text-lg font-serif font-semibold">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal ({items.length} items)</span><span>{formatPrice(getCartTotal())}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600">Free</span></div>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total</span><span>{formatPrice(getCartTotal())}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <p className="text-xs text-gray-400 text-center">Cash on Delivery available across Pakistan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
