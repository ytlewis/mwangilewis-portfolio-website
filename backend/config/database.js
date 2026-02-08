/**
 * Database Configuration
 * 
 * This module provides optimized MongoDB connection configuration
 * with connection pooling for improved performance.
 */

const mongoose = require('mongoose');

/**
 * Connection pool configuration
 * These settings optimize database performance by managing connections efficiently
 */
const connectionOptions = {
  // Connection Pool Settings
  maxPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5, // Max connections in pool
  minPoolSize: process.env.NODE_ENV === 'production' ? 2 : 1,  // Min connections to maintain
  
  // Timeout Settings
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  connectTimeoutMS: 10000, // Timeout for initial connection
  
  // Performance Settings
  maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
  waitQueueTimeoutMS: 10000, // Timeout for waiting for a connection from the pool
  
  // Network Settings
  family: 4, // Use IPv4, skip trying IPv6
  
  // Monitoring
  autoIndex: process.env.NODE_ENV !== 'production', // Build indexes in development only
};

/**
 * Connect to MongoDB with optimized settings
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise<typeof mongoose>}
 */
const connectDatabase = async (uri) => {
  const connectionUri = uri || process.env.MONGODB_URI;
  
  // Skip connection if no URI is provided
  if (!connectionUri) {
    throw new Error('No MongoDB URI provided. Set MONGODB_URI in .env file to enable database features.');
  }
  
  try {
    await mongoose.connect(connectionUri, connectionOptions);
    
    console.log('✓ Connected to MongoDB');
    console.log(`✓ Connection pool: ${connectionOptions.minPoolSize}-${connectionOptions.maxPoolSize} connections`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    
    return mongoose;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    throw error;
  }
};

/**
 * Set up connection event listeners for monitoring
 */
const setupConnectionListeners = () => {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('Mongoose reconnected to MongoDB');
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to application termination');
    process.exit(0);
  });
};

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('✗ Error disconnecting from MongoDB:', error.message);
    throw error;
  }
};

/**
 * Get connection pool statistics
 * @returns {Object} Pool statistics
 */
const getPoolStats = () => {
  const connection = mongoose.connection;
  
  if (connection.readyState !== 1) {
    return { connected: false };
  }

  return {
    connected: true,
    readyState: connection.readyState,
    host: connection.host,
    port: connection.port,
    name: connection.name,
    // Note: Mongoose doesn't expose detailed pool stats directly
    // These would need to be tracked separately if needed
  };
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  setupConnectionListeners,
  getPoolStats,
  connectionOptions
};
