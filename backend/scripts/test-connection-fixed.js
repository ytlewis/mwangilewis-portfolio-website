/**
 * Test MongoDB Connection with DNS Fix
 */

require('dotenv').config({ path: './backend/.env' });
const dns = require('dns');
const mongoose = require('mongoose');

// Configure Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('✓ DNS configured to use Google DNS\n');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection with DNS fix...');
    
    if (!process.env.MONGODB_URI) {
      console.error('✗ MONGODB_URI not found in .env file');
      process.exit(1);
    }

    const maskedUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
    console.log('Connecting to:', maskedUri);
    
    const startTime = Date.now();
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    const connectionTime = Date.now() - startTime;
    
    console.log('\n✓ Successfully connected to MongoDB!');
    console.log(`✓ Connection time: ${connectionTime}ms`);
    console.log('\nConnection Details:');
    console.log('=================================');
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Ready State: ${mongoose.connection.readyState} (1 = connected)`);
    console.log('=================================');
    
    // Test database operations
    console.log('\nTesting database operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✓ Found ${collections.length} collections:`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✓ Connection closed successfully');
    console.log('\n🎉 MongoDB connection test passed!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run db:init --prefix backend (to create admin user)');
    console.log('2. Run: npm run dev --prefix backend (to start backend server)');
    console.log('3. Access admin at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('\n✗ MongoDB connection test failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();
