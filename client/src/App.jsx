import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const TryOn = lazy(() => import('./pages/TryOn'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

const Loader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <Router>
              <CartProvider>
                <Toaster position="top-right" toastOptions={{
                  duration: 3000,
                  style: { background: '#111', color: '#fff', fontSize: '14px', borderRadius: '0' },
                  success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                }} />
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <CartDrawer />
                  <main className="flex-grow pt-[72px]">
                    <Suspense fallback={<Loader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:gender" element={<Products />} />
                        <Route path="/products/:gender/:category" element={<Products />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/tryon" element={<TryOn />} />
                        <Route path="/tryon/:id" element={<TryOn />} />
                        <Route path="*" element={
                          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                            <h1 className="text-5xl font-serif dark:text-white">404</h1>
                            <p className="text-gray-500 tracking-wider">Page not found</p>
                          </div>
                        } />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </Router>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;