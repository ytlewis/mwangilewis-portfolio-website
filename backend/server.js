const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const scheduler = require('./services/scheduler');
const { connectDatabase, setupConnectionListeners } = require('./config/database');
const { configureGoogleDNS } = require('./config/dns-fix');
require('dotenv').config();

// Configure DNS to use Google DNS (fixes MongoDB Atlas connection issues)
configureGoogleDNS();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const githubRoutes = require('./routes/github');

const app = express();

// Security middleware - Helmet.js with comprehensive security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.github.com"]
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for development
  frameguard: {
    action: 'deny' // Explicitly set X-Frame-Options to DENY
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration with specific policies
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://mwangilewis.com',
      'https://www.mwangilewis.com'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count']
};

app.use(cors(corsOptions));

// Rate limiting with different limits for different endpoints
// Use higher limits in test environment to avoid interference with property-based tests
const isTestEnv = process.env.NODE_ENV === 'test';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 10000 : 100, // Much higher limit in test environment
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 1000 : 5, // Higher limit in test environment
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isTestEnv ? 1000 : 10, // Higher limit in test environment
  message: {
    success: false,
    message: 'Too many contact form submissions, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Apply specific rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Apply specific rate limiting to contact routes
app.use('/api/contact', contactLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection with optimized pooling
// Only connect if not in test environment (tests handle their own connections)
if (process.env.NODE_ENV !== 'test') {
  connectDatabase()
    .then(() => {
      setupConnectionListeners();
    })
    .catch(err => {
      console.error('Failed to connect to database:', err);
      console.warn('⚠️  Server will continue running without database connection');
      console.warn('⚠️  Database-dependent features (contact form, admin) will not work');
      console.warn('⚠️  Please configure MONGODB_URI in backend/.env file');
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/github', githubRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Start the scheduler for periodic data refresh
    scheduler.start();
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  scheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  scheduler.stop();
  process.exit(0);
});

module.exports = app;