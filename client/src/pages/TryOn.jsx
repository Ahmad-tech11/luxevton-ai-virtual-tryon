import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Camera, UploadCloud, RefreshCw, AlertCircle,
  ArrowLeft, Download, CheckCircle2, Clock, Wand2, Shirt,
  ChevronRight, X, ZoomIn
} from 'lucide-react';
import api from '../services/api';

// ─── Step indicator ──────────────────────────────────────────────
const StepBadge = ({ number, label, active, done }) => (
  <div className="flex items-center gap-3">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
      done ? 'bg-green-500 text-white' : active ? 'bg-black text-white dark:bg-white dark:text-black scale-110' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
    }`}>
      {done ? <CheckCircle2 size={18} /> : number}
    </div>
    <span className={`text-sm font-medium tracking-wide transition-colors ${active || done ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
      {label}
    </span>
  </div>
);

// ─── Lightbox ────────────────────────────────────────────────────
const Lightbox = ({ src, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button onClick={onClose} className="absolute top-6 right-6 text-white/80 hover:text-white">
      <X size={28} />
    </button>
    <img src={src} alt="Enlarged" className="max-w-full max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
  </motion.div>
);

// ─── Progress bar (animated) ─────────────────────────────────────
const ProgressBar = ({ elapsed }) => {
  // Typical Fashn.ai processing = 20-120s. Smooth progress that slows as it nears 100%
  const pct = Math.min(95, (elapsed / 120) * 100);
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 overflow-hidden mt-4">
      <motion.div
        className="h-full bg-gradient-to-r from-luxury-gold to-yellow-500"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'linear' }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Main TryOn Component
// ═══════════════════════════════════════════════════════════════════
const TryOn = () => {
  const { id } = useParams();

  // ── Image states ──
  const [userImageFile, setUserImageFile] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState('');
  const [garmentImageFile, setGarmentImageFile] = useState(null);
  const [garmentImagePreview, setGarmentImagePreview] = useState('');
  const [garmentImageUrl, setGarmentImageUrl] = useState('');

  // ── Product info ──
  const [productTitle, setProductTitle] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productGender, setProductGender] = useState('');
  const [productLoading, setProductLoading] = useState(false);

  // ── Processing ──
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // ── Lightbox ──
  const [lightboxSrc, setLightboxSrc] = useState('');

  // ── Load product if navigated from product detail ──
  useEffect(() => {
    if (id) {
      setProductLoading(true);
      api.get(`/products/${id}`)
        .then(r => {
          const p = r.data;
          if (p?.images?.length) {
            setGarmentImageUrl(p.images[0]);
            setGarmentImagePreview(p.images[0]);
          }
          setProductTitle(p.title || '');
          setProductCategory(p.category || '');
          setProductGender(p.gender || '');
        })
        .catch(() => setError('Could not load product details.'))
        .finally(() => setProductLoading(false));
    }
  }, [id]);

  // ── Timer for elapsed seconds while processing ──
  useEffect(() => {
    if (loading) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [loading]);

  // ── Handlers ──
  const handleUserImage = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB.');
      return;
    }
    setUserImageFile(file);
    setUserImagePreview(URL.createObjectURL(file));
    setError('');
  }, []);

  const handleGarmentImage = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGarmentImageFile(file);
    setGarmentImagePreview(URL.createObjectURL(file));
    setGarmentImageUrl('');
    setProductTitle('Custom Upload');
    setError('');
  }, []);

  const resetAll = useCallback(() => {
    setResultImage('');
    setUserImageFile(null);
    setUserImagePreview('');
    setError('');
    setElapsed(0);
  }, []);

  const handleGenerate = async () => {
    if (!userImageFile) return setError('Please upload your photo first.');
    if (!garmentImageFile && !garmentImageUrl) return setError('Please upload or select a garment.');

    setLoading(true);
    setError('');
    setResultImage('');

    try {
      const formData = new FormData();
      formData.append('userImage', userImageFile);

      if (garmentImageFile) {
        formData.append('garmentImage', garmentImageFile);
      } else {
        formData.append('garmentImageUrl', garmentImageUrl);
      }

      formData.append('category', productCategory || 'upper body garment');

      const response = await api.post('/ai/tryon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 200000, // 200s client timeout
      });

      if (response.data.success) {
        setResultImage(response.data.imageUrl);
      } else {
        setError(response.data.message || 'Generation failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Derive current step ──
  const step = resultImage ? 4 : loading ? 3 : (userImagePreview && garmentImagePreview) ? 2 : 1;

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-[80vh]">
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc('')} />}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="bg-gray-950 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/30 to-purple-500/20" />
        </div>
        <div className="container-luxe relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={22} className="text-luxury-gold" />
              <span className="text-luxury-gold tracking-[0.35em] text-xs font-semibold uppercase">AI Powered</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif mb-3">Virtual Try-On Studio</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
              Upload your photo & see how any outfit looks on you — powered by state-of-the-art AI.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-luxe py-10">
        {/* Back link */}
        <Link
          to={id ? `/product/${id}` : '/products'}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to {id ? 'Product' : 'Collections'}
        </Link>

        {/* Step indicators */}
        <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-10">
          <StepBadge number={1} label="Upload Photo" active={step === 1} done={step > 1} />
          <ChevronRight size={16} className="text-gray-300 hidden sm:block" />
          <StepBadge number={2} label="Select Garment" active={step === 1 || step === 2} done={step > 2} />
          <ChevronRight size={16} className="text-gray-300 hidden sm:block" />
          <StepBadge number={3} label="AI Processing" active={step === 3} done={step > 3} />
          <ChevronRight size={16} className="text-gray-300 hidden sm:block" />
          <StepBadge number={4} label="Result" active={step === 4} done={false} />
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 border border-red-200 dark:border-red-900/30 flex items-start gap-3"
            >
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 dark:hover:text-red-300"><X size={18} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── LOADING STATE ────────────────────────────────────── */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
              <Wand2 size={28} className="absolute inset-0 m-auto text-luxury-gold" />
            </div>
            <h2 className="text-2xl font-serif mb-2 dark:text-white">AI is dressing you up…</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Our AI is analyzing your body and fitting the garment. This typically takes 20–120 seconds.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-2">
              <Clock size={14} />
              <span>{elapsed}s elapsed</span>
            </div>
            <ProgressBar elapsed={elapsed} />
            <p className="text-[11px] text-gray-400 mt-4">Please don't close this page.</p>
          </motion.div>
        )}

        {/* ─── RESULT STATE ─────────────────────────────────────── */}
        {!loading && resultImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 md:p-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <CheckCircle2 size={22} className="text-green-500" />
                <h2 className="text-2xl font-serif dark:text-white">Your Virtual Try-On Result</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Original photo */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 tracking-wider uppercase mb-3">Your Photo</p>
                  <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLightboxSrc(userImagePreview)}>
                    <img src={userImagePreview} alt="Original" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>

                {/* AI Result */}
                <div className="text-center">
                  <p className="text-xs text-luxury-gold tracking-wider uppercase mb-3 font-semibold">✨ AI Result</p>
                  <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-800 border-2 border-luxury-gold overflow-hidden cursor-pointer relative group" onClick={() => setLightboxSrc(resultImage)}>
                    <img src={resultImage} alt="AI Try-On" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                      <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* Garment */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 tracking-wider uppercase mb-3">Garment</p>
                  <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer" onClick={() => setLightboxSrc(garmentImagePreview)}>
                    <img src={garmentImagePreview} alt="Garment" className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={resultImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn-gold px-8 py-3 flex items-center gap-2"
                >
                  <Download size={18} /> Download Image
                </a>
                <button onClick={resetAll} className="btn-outline px-8 py-3 flex items-center gap-2">
                  <RefreshCw size={18} /> Try Another Look
                </button>
                {id && (
                  <Link to={`/product/${id}`} className="btn-primary px-8 py-3">
                    Proceed to Buy
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── UPLOAD STATE (main form) ─────────────────────────── */}
        {!loading && !resultImage && (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">

              {/* ── Left: Your Photo ── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-1">
                  <Camera size={20} className="text-luxury-gold" />
                  <h2 className="text-lg font-serif dark:text-white">Your Photo</h2>
                </div>
                <p className="text-xs text-gray-400 mb-5">Upload a clear, front-facing full-body or half-body photo.</p>

                {userImagePreview ? (
                  <div className="relative flex-1 min-h-[340px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden group">
                    <img src={userImagePreview} alt="You" className="absolute inset-0 w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                    <label className="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-4 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white flex items-center gap-2 transition-all">
                      <RefreshCw size={14} /> Change Photo
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUserImage} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex-1 min-h-[340px] border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all group">
                    <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Camera size={26} className="text-gray-400 group-hover:text-luxury-gold transition-colors" />
                    </div>
                    <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">Click to Upload Photo</span>
                    <span className="text-[11px] text-gray-400 mt-2">JPEG, PNG, WebP — Max 10MB</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUserImage} className="hidden" />
                  </label>
                )}
              </motion.div>

              {/* ── Right: Garment ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-1">
                  <Shirt size={20} className="text-luxury-gold" />
                  <h2 className="text-lg font-serif dark:text-white">Garment</h2>
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  {id && productTitle ? (
                    <>Selected: <span className="font-medium text-black dark:text-white">{productTitle}</span></>
                  ) : (
                    'Upload a clothing image or browse our collections.'
                  )}
                </p>

                {garmentImagePreview ? (
                  <div className="relative flex-1 min-h-[340px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden group">
                    <img src={garmentImagePreview} alt="Garment" className="absolute inset-0 w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                    {!id && (
                      <label className="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-4 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white flex items-center gap-2 transition-all">
                        <RefreshCw size={14} /> Change Garment
                        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleGarmentImage} className="hidden" />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 min-h-[340px] flex flex-col gap-4">
                    <label className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all group">
                      <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <UploadCloud size={26} className="text-gray-400 group-hover:text-luxury-gold transition-colors" />
                      </div>
                      <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">Upload Garment Image</span>
                      <span className="text-[11px] text-gray-400 mt-2">Clear flat-lay or product photo works best</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleGarmentImage} className="hidden" />
                    </label>
                    <Link
                      to="/products"
                      className="text-center text-sm text-luxury-gold hover:text-black dark:hover:text-white border border-luxury-gold/30 hover:border-black dark:hover:border-white py-3 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} /> Browse Our Collections
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-center"
            >
              <button
                onClick={handleGenerate}
                disabled={!userImagePreview || !garmentImagePreview}
                className={`inline-flex items-center justify-center gap-3 text-base font-semibold tracking-wide px-14 py-4 transition-all duration-300 ${
                  userImagePreview && garmentImagePreview
                    ? 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-white hover:shadow-lg hover:shadow-luxury-gold/30 hover:scale-[1.02] cursor-pointer'
                    : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <Wand2 size={20} /> Generate Virtual Try-On
              </button>
              <p className="text-xs text-gray-400 mt-3">
                Processing takes ~20–120 seconds. Our premium AI generates a high-fidelity image of you wearing the garment.
              </p>
            </motion.div>

            {/* How it works */}
            <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-serif text-center mb-8 dark:text-white">How It Works</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: <Camera size={24} />, title: 'Upload Your Photo', desc: 'Take a front-facing full-body or upper-body photo with good lighting.' },
                  { icon: <Shirt size={24} />, title: 'Pick a Garment', desc: 'Select any clothing from our store or upload your own garment photo.' },
                  { icon: <Wand2 size={24} />, title: 'AI Magic', desc: 'Our AI analyzes your body shape and generates a realistic try-on image in seconds.' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-6 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-gray-500 hover:shadow-lg transition-all group"
                  >
                    <div className="text-luxury-gold mb-4 flex justify-center group-hover:scale-110 transition-transform">{s.icon}</div>
                    <h4 className="font-semibold text-sm mb-2 tracking-wide dark:text-white">{s.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOn;
