/**
 * Test MongoDB Connection Script
 * 
 * This script tests the MongoDB connection and displays connection details.
 * 
 * Usage: node backend/scripts/test-connection.js
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    if (!process.env.MONGODB_URI) {
      console.error('✗ MONGODB_URI not found in .env file');
      process.exit(1);
    }

    // Mask password in URI for display
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
    
    // Test a simple operation
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
    
  } catch (error) {
    console.error('\n✗ MongoDB connection test failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication failed. Please check:');
      console.error('   - Username and password are correct');
      console.error('   - Special characters in password are URL-encoded');
      console.error('   - Database user has proper permissions');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.error('\n💡 Connection timeout. Please check:');
      console.error('   - Your internet connection');
      console.error('   - MongoDB Atlas cluster is running');
      console.error('   - IP address is whitelisted in MongoDB Atlas');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection();
