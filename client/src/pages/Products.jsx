import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { MENU_DATA, formatCategoryName } from '../data/categories';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SEASONS = ['summer', 'winter', 'all-season'];

const Products = () => {
  const { gender, category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const season = searchParams.get('season') || '';
  const size = searchParams.get('size') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (gender) params.set('gender', gender);
      if (category) params.set('category', category);
      params.set('sort', sort);
      params.set('page', page);
      params.set('limit', 24);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (season) params.set('season', season);
      if (size) params.set('size', size);

      const res = await api.get(`/products?${params.toString()}`);
      let fetched = res.data.products || [];

      // When viewing all products for a gender (no specific category) with default sort,
      // re-order products to follow the sidebar category sequence from MENU_DATA
      if (gender && !category && sort === 'newest' && MENU_DATA[gender]) {
        const catOrder = MENU_DATA[gender].categories.map(c => c.slug);
        fetched.sort((a, b) => {
          const idxA = catOrder.indexOf(a.category);
          const idxB = catOrder.indexOf(b.category);
          return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
        });
      }

      setProducts(fetched);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [gender, category, sort, page, minPrice, maxPrice, season, size]);

  useEffect(() => { setPage(1); }, [gender, category, sort, minPrice, maxPrice, season, size]);
  useEffect(() => { fetchProducts(); window.scrollTo(0, 0); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    const sp = new URLSearchParams(searchParams);
    if (value) sp.set(key, value); else sp.delete(key);
    setSearchParams(sp);
  };

  const clearFilters = () => setSearchParams({});

  const menuCats = gender ? MENU_DATA[gender]?.categories || [] : [];
  const title = category ? formatCategoryName(category) : gender ? `${MENU_DATA[gender]?.label || gender} Collection` : 'All Collections';

  return (
    <div className="container-luxe py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 tracking-wider uppercase">
        <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link> /
        {gender && <><Link to={`/products/${gender}`} className="hover:text-black dark:hover:text-white">{MENU_DATA[gender]?.label || gender}</Link> /</>}
        <span className="text-black dark:text-white">{category ? formatCategoryName(category) : 'All'}</span>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-60 shrink-0 space-y-6">
          <h2 className="text-lg font-serif font-semibold dark:text-white">{title}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{total} products</p>

          {/* Gender filter when no gender in URL */}
          {!gender && (
            <FilterSection title="Gender">
              {['men', 'women', 'kids'].map(g => (
                <Link key={g} to={`/products/${g}`} className="block text-base text-gray-600 dark:text-gray-400 py-1 hover:text-black dark:hover:text-white capitalize">{g}</Link>
              ))}
            </FilterSection>
          )}

          {/* Categories */}
          {menuCats.length > 0 && (
            <FilterSection title="Categories">
              <Link to={`/products/${gender}`} className={`block text-base py-1.5 ${!category ? 'text-black dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>All {MENU_DATA[gender]?.label}</Link>
              {menuCats.map(c => (
                <Link key={c.slug} to={`/products/${gender}/${c.slug}`} className={`block text-base py-1.5 ${category === c.slug ? 'text-black dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>{c.label}</Link>
              ))}
            </FilterSection>
          )}

          {/* Size */}
          <FilterSection title="Size">
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} onClick={() => updateFilter('size', size === s ? '' : s)} className={`px-4 py-2 text-sm border transition-colors ${size === s ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white dark:text-gray-300'}`}>{s}</button>
              ))}
            </div>
          </FilterSection>

          {/* Season */}
          <FilterSection title="Season">
            {SEASONS.map(s => (
              <button key={s} onClick={() => updateFilter('season', season === s ? '' : s)} className={`block text-base py-1.5 capitalize ${season === s ? 'text-black dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>{s.replace('-', ' ')}</button>
            ))}
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="w-full border dark:border-gray-700 bg-transparent px-2 py-1.5 text-sm dark:text-white focus:outline-none focus:border-black dark:focus:border-white" />
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="w-full border dark:border-gray-700 bg-transparent px-2 py-1.5 text-sm dark:text-white focus:outline-none focus:border-black dark:focus:border-white" />
            </div>
          </FilterSection>

          {(minPrice || maxPrice || season || size) && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">Clear All Filters</button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-800">
            <div className="flex items-center gap-3">
              <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-1.5 text-sm border dark:border-gray-700 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200">
                <SlidersHorizontal size={16} /> Filters
              </button>
              <h1 className="text-xl font-serif font-semibold hidden lg:block dark:text-white">{total} Results</h1>
            </div>
            <div className="flex items-center gap-4">
              <select value={sort} onChange={e => updateFilter('sort', e.target.value)} className="text-sm border-0 border-b border-gray-300 dark:border-gray-700 pb-1 focus:outline-none focus:border-black dark:focus:border-white bg-transparent cursor-pointer dark:text-white">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="hidden md:flex items-center gap-1 border-l dark:border-gray-700 pl-4">
                <button onClick={() => setGridCols(3)} className={`p-1 ${gridCols === 3 ? 'text-black dark:text-white' : 'text-gray-400'}`}><Grid3X3 size={18} /></button>
                <button onClick={() => setGridCols(4)} className={`p-1 ${gridCols === 4 ? 'text-black dark:text-white' : 'text-gray-400'}`}><LayoutGrid size={18} /></button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-800 aspect-[3/4] mb-3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">No products found</p>
              <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 md:gap-6`}>
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 text-sm border dark:border-gray-700 transition-colors ${p === page ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[60]" onClick={() => setFiltersOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-[70] p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif font-semibold dark:text-white">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="dark:text-gray-300"><X size={22} /></button>
              </div>
              {/* Same filter content as sidebar */}
              {!gender && (
                <FilterSection title="Gender">
                  {['men', 'women', 'kids'].map(g => (
                    <Link key={g} to={`/products/${g}`} onClick={() => setFiltersOpen(false)} className="block text-sm text-gray-600 dark:text-gray-400 py-1 hover:text-black dark:hover:text-white capitalize">{g}</Link>
                  ))}
                </FilterSection>
              )}
              {menuCats.length > 0 && (
                <FilterSection title="Categories">
                  {menuCats.map(c => (
                    <Link key={c.slug} to={`/products/${gender}/${c.slug}`} onClick={() => setFiltersOpen(false)} className={`block text-sm py-1 ${category === c.slug ? 'text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>{c.label}</Link>
                  ))}
                </FilterSection>
              )}
              <FilterSection title="Size">
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => { updateFilter('size', size === s ? '' : s); setFiltersOpen(false); }} className={`px-3 py-1.5 text-xs border ${size === s ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-gray-300 dark:border-gray-700 dark:text-gray-300'}`}>{s}</button>
                  ))}
                </div>
              </FilterSection>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b dark:border-gray-800 pb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-sm font-semibold tracking-wider uppercase mb-3 dark:text-white">
        {title} <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

export default Products;