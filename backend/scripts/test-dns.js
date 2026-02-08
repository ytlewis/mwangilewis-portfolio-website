/**
 * Test DNS Resolution
 */

const dns = require('dns').promises;

async function testDNS() {
  const hostname = 'cluster0.q5hcdie.mongodb.net';
  const srvRecord = `_mongodb._tcp.${hostname}`;
  
  console.log('Testing DNS resolution...\n');
  
  // Test 1: Regular DNS lookup
  console.log(`1. Testing regular DNS lookup for: ${hostname}`);
  try {
    const addresses = await dns.resolve4(hostname);
    console.log(`✓ Success: ${addresses.join(', ')}`);
  } catch (error) {
    console.log(`✗ Failed: ${error.message}`);
  }
  
  // Test 2: SRV record lookup
  console.log(`\n2. Testing SRV record lookup for: ${srvRecord}`);
  try {
    const records = await dns.resolveSrv(srvRecord);
    console.log(`✓ Success: Found ${records.length} records`);
    records.forEach(r => console.log(`   - ${r.name}:${r.port}`));
  } catch (error) {
    console.log(`✗ Failed: ${error.message}`);
  }
  
  // Test 3: Try Google's DNS
  console.log(`\n3. Testing with Google DNS (8.8.8.8)...`);
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  try {
    const records = await dns.resolveSrv(srvRecord);
    console.log(`✓ Success with Google DNS: Found ${records.length} records`);
    records.forEach(r => console.log(`   - ${r.name}:${r.port}`));
  } catch (error) {
    console.log(`✗ Failed with Google DNS: ${error.message}`);
  }
  
  // Test 4: Try Cloudflare DNS
  console.log(`\n4. Testing with Cloudflare DNS (1.1.1.1)...`);
  dns.setServers(['1.1.1.1', '1.0.0.1']);
  try {
    const records = await dns.resolveSrv(srvRecord);
    console.log(`✓ Success with Cloudflare DNS: Found ${records.length} records`);
    records.forEach(r => console.log(`   - ${r.name}:${r.port}`));
  } catch (error) {
    console.log(`✗ Failed with Cloudflare DNS: ${error.message}`);
  }
  
  console.log('\n=================================');
  console.log('Conclusion:');
  console.log('=================================');
  console.log('If all DNS tests failed, the cluster hostname is likely incorrect.');
  console.log('Please verify the connection string in MongoDB Atlas.');
  console.log('\nSteps:');
  console.log('1. Log into https://cloud.mongodb.com/');
  console.log('2. Go to your cluster');
  console.log('3. Click "Connect" button');
  console.log('4. Choose "Connect your application"');
  console.log('5. Copy the connection string');
  console.log('6. Share the connection string (mask the password)');
}

testDNS();
