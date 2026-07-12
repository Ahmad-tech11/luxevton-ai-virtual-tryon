import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Minus, Plus, Star, Sparkles, Truck, RefreshCw, Shield, MessageCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { formatPrice, getDiscount, formatCategoryName } from '../data/categories';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const number = "923106365720";
    let text = "Hi, I would like to order this product:\n\n";
    text += `- ${product.title} (Size: ${selectedSize}${selectedColor ? ', Color: ' + selectedColor : ''}) x ${quantity} = ${formatPrice(product.price * quantity)}\n`;
    text += `\nTotal Amount: ${formatPrice(product.price * quantity)}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');
  };

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`).then(r => {
      const p = r.data;
      setProduct(p);
      setSelectedSize(p.sizes?.[1] || p.sizes?.[0] || '');
      setSelectedColor(p.colors?.[0]?.name || '');
      setActiveImg(0);
      setQuantity(1);
      addToRecentlyViewed(p);
      // Fetch related
      api.get(`/products?gender=${p.gender}&category=${p.category}&limit=4`).then(r2 => {
        setRelated((r2.data.products || []).filter(x => x._id !== p._id).slice(0, 4));
      });
    }).catch(() => { }).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="container-luxe py-12">
      <div className="grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-[3/4] bg-gray-200" />
        <div className="space-y-4"><div className="h-6 bg-gray-200 w-3/4" /><div className="h-4 bg-gray-200 w-1/2" /><div className="h-8 bg-gray-200 w-1/3" /></div>
      </div>
    </div>
  );

  if (!product) return <div className="container-luxe py-20 text-center"><p>Product not found</p></div>;

  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <div className="container-luxe py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 tracking-wider uppercase">
        <Link to="/" className="hover:text-black">Home</Link> /
        <Link to={`/products/${product.gender}`} className="hover:text-black capitalize">{product.gender}</Link> /
        <Link to={`/products/${product.gender}/${product.category}`} className="hover:text-black dark:hover:text-white">{formatCategoryName(product.category)}</Link> /
        <span className="text-black dark:text-white truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden mb-3">
            <img src={product.images?.[activeImg]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-24 border-2 overflow-hidden ${i === activeImg ? 'border-black dark:border-white' : 'border-gray-200 dark:border-gray-700'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div>
            <p className="text-xs text-gray-400 tracking-wider uppercase mb-1">{formatCategoryName(product.category)}</p>
            <h1 className="text-2xl md:text-3xl font-serif font-medium mb-3 dark:text-white">{product.title}</h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5">-{discount}%</span>
                </>
              )}
            </div>
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">{Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill={i < Math.round(product.rating) ? '#C9A96E' : 'none'} color="#C9A96E" />)}</div>
                <span className="text-xs text-gray-500 dark:text-gray-400">({product.numReviews} reviews)</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2 tracking-wider uppercase dark:text-white">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[48px] py-2 text-sm border transition-colors ${selectedSize === s ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-gray-300 hover:border-black dark:border-gray-700 dark:hover:border-white'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2 tracking-wider uppercase dark:text-white">Color: <span className="font-normal text-gray-600 dark:text-gray-400">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-black dark:border-white scale-110' : 'border-gray-200 dark:border-gray-700'}`} style={{ background: c.hex }} title={c.name} />
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border dark:border-gray-700">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"><Minus size={16} /></button>
              <span className="px-5 font-medium dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"><Plus size={16} /></button>
            </div>
            <button onClick={() => addToCart(product, quantity, selectedSize, selectedColor, product.images?.[activeImg])} className="btn-primary flex-1">
              <ShoppingBag size={18} /> Add to Bag
            </button>
            <button onClick={() => toggleWishlist(product)} className={`w-12 h-12 border flex items-center justify-center transition-colors ${isInWishlist(product._id) ? 'border-luxury-gold text-luxury-gold' : 'border-gray-300 hover:border-black dark:border-gray-700 dark:hover:border-white'}`}>
              <Heart size={20} fill={isInWishlist(product._id) ? '#C9A96E' : 'none'} />
            </button>
          </div>

          {/* AI Try-On & WhatsApp */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link to={`/tryon/${product._id}`} className="btn-gold w-full text-center">
              <Sparkles size={16} /> Try On with AI
            </Link>
            <button onClick={handleWhatsAppOrder} className="w-full btn-whatsapp">
              <MessageCircle size={16} /> WhatsApp
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            {[
              { icon: <Truck size={18} />, label: 'Free Shipping' },
              { icon: <RefreshCw size={18} />, label: '7-Day Returns' },
              { icon: <Shield size={18} />, label: 'Secure Checkout' },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="text-luxury-gold flex justify-center mb-1">{f.icon}</div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          {(product.fabric || product.season) && (
            <div className="border-t dark:border-gray-800 pt-4 space-y-2 text-sm dark:text-gray-300">
              {product.fabric && <p><span className="font-medium dark:text-white">Fabric:</span> {product.fabric}</p>}
              {product.season && <p><span className="font-medium dark:text-white">Season:</span> {product.season.replace('-', ' ')}</p>}
              {product.occasion && <p><span className="font-medium dark:text-white">Occasion:</span> {product.occasion}</p>}
            </div>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 pt-10 border-t dark:border-gray-800">
          <h2 className="text-2xl font-serif font-medium mb-8 dark:text-white">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
