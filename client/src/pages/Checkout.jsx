import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/categories';

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sargodha', 'Bahawalpur', 'Abbottabad', 'Mardan', 'Sahiwal'];

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', notes: '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleWhatsAppOrder = () => {
    const number = "923106365720";
    let text = "Hi, I would like to place an order from Luxe VTON:\n\n";
    items.forEach(item => {
      text += `- ${item.title} (Size: ${item.size}${item.color ? ', Color: ' + item.color : ''}) x ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
    });
    text += `\nTotal Amount: ${formatPrice(getCartTotal())}`;
    
    if (form.fullName || form.phone) {
      text += `\n\nCustomer Details:`;
      if (form.fullName) text += `\nName: ${form.fullName}`;
      if (form.phone) text += `\nPhone: ${form.phone}`;
      if (form.address) text += `\nAddress: ${form.address}, ${form.city}`;
    }
    
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city) return toast.error('Please fill all required fields');

    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        products: items.map(i => ({
          productId: i.productId, title: i.title, image: i.image,
          price: i.price, size: i.size, color: i.color, quantity: i.quantity,
        })),
        totalPrice: getCartTotal(),
        shippingAddress: {
          fullName: form.fullName, email: form.email, phone: form.phone,
          address: form.address, city: form.city, state: form.state, zipCode: form.zipCode,
        },
        paymentMethod: 'cod',
        notes: form.notes,
      });

      setOrderPlaced(res.data.order);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container-luxe py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-3xl font-serif mb-2 text-green-600 dark:text-green-500">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-2">Your order <strong>#{orderPlaced.orderNumber}</strong> has been placed successfully.</p>
        <p className="text-gray-400 text-sm mb-6">You will receive a confirmation shortly.</p>
        <div className="bg-gray-50 dark:bg-gray-800 inline-block p-6 text-left mb-6 rounded">
          <p className="text-sm dark:text-gray-200"><strong>Total:</strong> {formatPrice(orderPlaced.totalPrice)}</p>
          <p className="text-sm dark:text-gray-200"><strong>Payment:</strong> Cash on Delivery</p>
          <p className="text-sm dark:text-gray-200"><strong>Status:</strong> Processing</p>
        </div>
        <div>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="text-3xl font-serif mb-4 dark:text-white">No items in cart</h1>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-8">
      <h1 className="text-3xl font-serif font-medium mb-8 dark:text-white">Checkout</h1>
      <div className="grid lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-lg font-serif font-semibold mb-4 dark:text-white">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5 dark:text-gray-300">Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border dark:border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white" placeholder="Muhammad Ahmad" />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5 dark:text-gray-300">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border dark:border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5 dark:text-gray-300">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border dark:border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white" placeholder="03XX XXXXXXX" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5 dark:text-gray-300">Address *</label>
                <input name="address" value={form.address} onChange={handleChange} required className="w-full border dark:border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white" placeholder="House/Street address" />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5 dark:text-gray-300">City *</label>
                <select name="city" value={form.city} onChange={handleChange} required className="w-full border dark:border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 dark:text-white">
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5 dark:text-gray-300">Zip Code</label>
                <input name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full border dark:border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white" placeholder="Optional" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5 dark:text-gray-300">Order Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full border dark:border-gray-700 px-4 py-2.5 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent dark:text-white resize-none" placeholder="Special instructions..." />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-serif font-semibold mb-4 dark:text-white">Payment Method</h2>
            <div className="border dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-black dark:border-white rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black dark:bg-white rounded-full" /></div>
              <div>
                <p className="text-sm font-medium dark:text-white">Cash on Delivery</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pay when your order arrives</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={submitting} className="btn-primary flex-1 text-center">
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Placing Order...</> : 'Place Order'}
            </button>
            <button type="button" onClick={handleWhatsAppOrder} className="flex-1 btn-whatsapp">
              <MessageCircle size={18} /> Order via WhatsApp
            </button>
          </div>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 sticky top-24 rounded">
            <h3 className="text-lg font-serif font-semibold mb-4 dark:text-white">Order Summary</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item.key} className="flex gap-3">
                  <div className="w-14 h-18 bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.size} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium whitespace-nowrap dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t dark:border-gray-700 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span className="dark:text-white">{formatPrice(getCartTotal())}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span className="text-green-600">Free</span></div>
              <div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-3"><span className="dark:text-white">Total</span><span className="dark:text-white">{formatPrice(getCartTotal())}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
