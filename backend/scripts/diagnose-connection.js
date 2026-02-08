/**
 * MongoDB Connection Diagnostics Script
 * 
 * This script provides detailed diagnostics for MongoDB connection issues.
 * 
 * Usage: node backend/scripts/diagnose-connection.js
 */

require('dotenv').config({ path: './backend/.env' });
const dns = require('dns').promises;
const { URL } = require('url');

async function diagnoseConnection() {
  console.log('MongoDB Connection Diagnostics');
  console.log('=================================\n');

  // Check if MONGODB_URI exists
  if (!process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI not found in .env file');
    console.log('\n💡 Solution:');
    console.log('   1. Create backend/.env file');
    console.log('   2. Add: MONGODB_URI=your-connection-string');
    process.exit(1);
  }

  console.log('✓ MONGODB_URI found in environment');
  
  // Parse connection string
  const uri = process.env.MONGODB_URI;
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log(`Connection String: ${maskedUri}\n`);

  try {
    // Extract hostname from URI
    let hostname;
    if (uri.startsWith('mongodb+srv://')) {
      // SRV format
      const match = uri.match(/mongodb\+srv:\/\/[^@]+@([^\/\?]+)/);
      if (match) {
        hostname = match[1];
        console.log(`✓ Detected SRV connection format`);
        console.log(`Hostname: ${hostname}\n`);

        // Test DNS resolution for SRV record
        console.log('Testing DNS resolution for SRV record...');
        try {
          const srvRecord = `_mongodb._tcp.${hostname}`;
          console.log(`Looking up: ${srvRecord}`);
          
          const records = await dns.resolveSrv(srvRecord);
          console.log(`✓ DNS SRV resolution successful!`);
          console.log(`Found ${records.length} MongoDB server(s):`);
          records.forEach((record, i) => {
            console.log(`  ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority})`);
          });
        } catch (dnsError) {
          console.error(`✗ DNS SRV resolution failed: ${dnsError.message}`);
          console.log('\n💡 Possible causes:');
          console.log('   1. Incorrect cluster hostname');
          console.log('   2. Cluster is paused or deleted');
          console.log('   3. DNS server issues');
          console.log('\n💡 Solutions:');
          console.log('   1. Verify cluster URL in MongoDB Atlas');
          console.log('   2. Check if cluster is running');
          console.log('   3. Try a different network/DNS');
          return;
        }
      }
    } else if (uri.startsWith('mongodb://')) {
      // Standard format
      const match = uri.match(/mongodb:\/\/[^@]+@([^\/\?:]+)/);
      if (match) {
        hostname = match[1];
        console.log(`✓ Detected standard connection format`);
        console.log(`Hostname: ${hostname}\n`);

        // Test DNS resolution
        console.log('Testing DNS resolution...');
        try {
          const addresses = await dns.resolve4(hostname);
          console.log(`✓ DNS resolution successful!`);
          console.log(`IP addresses: ${addresses.join(', ')}`);
        } catch (dnsError) {
          console.error(`✗ DNS resolution failed: ${dnsError.message}`);
          return;
        }
      }
    }

    // Check for common issues in connection string
    console.log('\nConnection String Analysis:');
    
    if (uri.includes('<') || uri.includes('>')) {
      console.error('✗ Connection string contains placeholder brackets < >');
      console.log('   Replace <username>, <password>, etc. with actual values');
    } else {
      console.log('✓ No placeholder brackets found');
    }

    if (uri.includes('!') || uri.includes('@') || uri.includes('#')) {
      console.warn('⚠️  Special characters detected in connection string');
      console.log('   Ensure special characters in password are URL-encoded:');
      console.log('   ! → %21');
      console.log('   @ → %40');
      console.log('   # → %23');
      console.log('   $ → %24');
      console.log('   % → %25');
    }

    // Extract database name
    const dbMatch = uri.match(/\/([^\/\?]+)(\?|$)/);
    if (dbMatch && dbMatch[1]) {
      console.log(`✓ Database name: ${dbMatch[1]}`);
    } else {
      console.warn('⚠️  No database name specified in connection string');
    }

    // Check for required parameters
    if (uri.includes('retryWrites=true')) {
      console.log('✓ retryWrites parameter present');
    }
    if (uri.includes('w=majority')) {
      console.log('✓ w=majority parameter present');
    }

    console.log('\n=================================');
    console.log('Next Steps:');
    console.log('=================================');
    console.log('1. Verify the cluster URL in MongoDB Atlas');
    console.log('2. Ensure your IP is whitelisted (Network Access)');
    console.log('3. Verify database user credentials (Database Access)');
    console.log('4. Run: npm run db:test --prefix backend');

  } catch (error) {
    console.error('\n✗ Error during diagnostics:', error.message);
  }
}

// Run diagnostics
diagnoseConnection();
