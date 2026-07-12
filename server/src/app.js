require('dotenv').config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const {
  helmetMiddleware,
  corsOptions,
  globalLimiter,
  mongoSanitizeMiddleware,
} = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(compression());
app.use(cors(corsOptions));
app.use(globalLimiter);
app.use(mongoSanitizeMiddleware);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: process.env.NODE_ENV === 'production' ? '30d' : 0,
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff');
  },
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// Mount API routes - no auth needed
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/ai', aiRoutes);

// Also mount at /api for backward compatibility
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api', (req, res) => {
  res.json({
    name: 'LUXE VTON API',
    version: '2.0.0',
    status: 'running',
    documentation: '/api/health',
  });
});

// Seed route (dev only)
if (process.env.NODE_ENV !== 'production') {
  const { seedDatabase } = require('./utils/seed');

  app.post('/api/seed', async (req, res, next) => {
    try {
      await seedDatabase();
      res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      next(error);
    }
  });
}

// Serve client in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientBuildPath));
  app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('LUXE VTON API is running...');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;