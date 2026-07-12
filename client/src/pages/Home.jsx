import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { MENU_DATA } from '../data/categories';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const Home = () => {
  const [menFeatured, setMenFeatured] = useState([]);
  const [womenFeatured, setWomenFeatured] = useState([]);
  const [kidsFeatured, setKidsFeatured] = useState([]);
  const [menNew, setMenNew] = useState([]);
  const [womenNew, setWomenNew] = useState([]);
  const { recentItems, clearRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    // Fetch 4 featured products for each gender
    api.get('/products?featured=true&gender=men&limit=4').then(r => setMenFeatured(r.data.products || [])).catch(() => { });
    api.get('/products?featured=true&gender=women&limit=4').then(r => setWomenFeatured(r.data.products || [])).catch(() => { });
    api.get('/products?featured=true&gender=kids&limit=4').then(r => setKidsFeatured(r.data.products || [])).catch(() => { });

    // New arrivals for sections further down
    api.get('/products?gender=men&sort=newest&limit=4').then(r => setMenNew(r.data.products || [])).catch(() => { });
    api.get('/products?gender=women&sort=newest&limit=4').then(r => setWomenNew(r.data.products || [])).catch(() => { });
  }, []);

  return (
    <div>
      {/* ... Hero and Features Bar omitted for brevity ... */}

      {/* Hero */}
      <section className="relative h-[85vh] bg-gray-950 overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img src="/images/homepage/hero.png" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="container-luxe relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
            <p className="text-luxury-gold tracking-[0.4em] text-base font-medium mb-4 uppercase">Premium Fashion</p>
            <h1 className="text-6xl md:text-8xl font-serif text-white leading-[1.1] mb-6">Redefine Your Style</h1>
            <p className="text-gray-300 text-xl md:text-2xl mb-8 leading-relaxed">Discover the finest Pakistani fashion collections with AI-powered virtual try-on. Shop men, women & kids clothing.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/products/men" className="btn-primary bg-white text-black hover:bg-gray-200 text-lg px-8 py-4">Shop Men</Link>
              <Link to="/products/women" className="btn-outline border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4">Shop Women</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-luxury-warm dark:bg-gray-900 border-y dark:border-gray-800">
        <div className="container-luxe py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'Orders above PKR 5,000' },
            { icon: <Shield size={24} />, title: 'Secure Checkout', desc: '100% secure payment' },
            { icon: <RefreshCw size={24} />, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: <Sparkles size={24} />, title: 'AI Try-On', desc: 'Try before you buy' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-4 justify-center">
              <div className="text-luxury-gold">{f.icon}</div>
              <div>
                <p className="text-sm md:text-base font-semibold tracking-wider uppercase">{f.title}</p>
                <p className="text-xs md:sm text-gray-500 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gender Cards */}
      <section className="container-luxe py-20">
        <motion.div {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-2">Shop By Category</h2>
          <p className="text-lg text-gray-500 text-center mb-10">Explore our premium collections</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { to: '/products/men', label: 'Men', img: '/images/homepage/men-category.png' },
            { to: '/products/women', label: 'Women', img: '/images/homepage/women-category.png' },
            { to: '/products/kids', label: 'Kids', img: '/images/homepage/kids-category.png' },
          ].map((c, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}>
              <Link to={c.to} className="group relative block h-[450px] overflow-hidden bg-gray-100">
                <img src={c.img} alt={c.label} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-3">{c.label}</h3>
                  <span className="text-white/90 text-base flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Collection <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="bg-luxury-warm dark:bg-gray-900 py-20">
        <div className="container-luxe">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-2">Featured Collection</h2>
            <p className="text-lg text-gray-500 text-center mb-16">Handpicked premium pieces for you</p>
          </motion.div>

          {/* Men's Row */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-2 border-b dark:border-gray-700">
              <h3 className="text-2xl md:text-3xl font-serif">Men's Featured</h3>
              <Link to="/products/men?featured=true" className="text-luxury-gold hover:underline flex items-center gap-2">View All Men <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {menFeatured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>

          {/* Women's Row */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-2 border-b dark:border-gray-700">
              <h3 className="text-2xl md:text-3xl font-serif">Women's Featured</h3>
              <Link to="/products/women?featured=true" className="text-luxury-gold hover:underline flex items-center gap-2">View All Women <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {womenFeatured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>

          {/* Kids' Row */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8 pb-2 border-b dark:border-gray-700">
              <h3 className="text-2xl md:text-3xl font-serif">Kids' Featured</h3>
              <Link to="/products/kids?featured=true" className="text-luxury-gold hover:underline flex items-center gap-2">View All Kids <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {kidsFeatured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/products?featured=true" className="btn-outline text-lg px-10 py-4">View All Featured Collection</Link>
          </div>
        </div>
      </section>

      {/* Men New Arrivals */}
      {menNew.length > 0 && (
        <section className="container-luxe py-20">
          <motion.div {...fadeUp}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-medium">Men's New Arrivals</h2>
                <p className="text-base text-gray-500 tracking-wider uppercase mt-2">Latest additions for men</p>
              </div>
              <Link to="/products/men" className="btn-outline hidden md:inline-flex text-lg px-8 py-3">View All</Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {menNew.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Women New Arrivals */}
      {womenNew.length > 0 && (
        <section className="bg-luxury-warm dark:bg-gray-900 py-20">
          <div className="container-luxe">
            <motion.div {...fadeUp}>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <h2 className="text-4xl md:text-5xl font-serif font-medium">Women's New Arrivals</h2>
                  <p className="text-base text-gray-500 tracking-wider uppercase mt-2">Latest additions for women</p>
                </div>
                <Link to="/products/women" className="btn-outline hidden md:inline-flex text-lg px-8 py-3">View All</Link>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {womenNew.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* AI Try-On Banner */}
      <section className="container-luxe py-20">
        <motion.div {...fadeUp}>
          <div className="relative bg-gray-950 p-10 md:p-20 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-luxury-gold" size={28} />
                <span className="text-luxury-gold tracking-[0.3em] text-base font-medium">AI POWERED</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Virtual Try-On</h2>
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">See how clothes look on you before purchasing. Our AI technology creates realistic try-on experiences.</p>
              <Link to="/tryon" className="btn-gold text-lg px-10 py-4">Try It Now</Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Men Categories Grid */}
      <section className="container-luxe py-16">
        <motion.div {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-2">Men's Collections</h2>
          <p className="text-lg text-gray-500 text-center mb-10">Explore all men's categories</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {MENU_DATA.men.categories.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
              <Link to={`/products/men/${cat.slug}`} className="category-btn group">
                <p>{cat.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Women Categories Grid */}
      <section className="bg-luxury-warm dark:bg-gray-900 py-16">
        <div className="container-luxe">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-2">Women's Collections</h2>
            <p className="text-lg text-gray-500 text-center mb-10">Explore all women's categories</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {MENU_DATA.women.categories.map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <Link to={`/products/women/${cat.slug}`} className="category-btn group">
                  <p>{cat.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentItems.length > 0 && (
        <section className="container-luxe py-16 border-t dark:border-gray-800">
          <motion.div {...fadeUp}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-serif font-medium dark:text-white">Recently Viewed</h2>
                <p className="text-base text-gray-500 tracking-wider uppercase mt-2">Products you checked out recently</p>
              </div>
              <button onClick={clearRecentlyViewed} className="btn-outline text-sm px-6 py-2 mx-auto md:mx-0 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20">
                Clear History
              </button>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {recentItems.slice(0, 5).map((p, i) => <ProductCard key={p.productId} product={{ ...p, _id: p.productId }} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
