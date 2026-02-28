// Test Backend Connection and Configuration
const https = require('https');
const http = require('http');

console.log('========================================');
console.log('  Testing Backend Connection');
console.log('========================================\n');

// Test URLs
const backendUrls = [
  'https://lewis-portfolio-backend.onrender.com',
  'https://mwangilewis-portfolio-backend.up.railway.app',
  'http://localhost:5000'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const healthUrl = `${url}/api/health`;
    
    console.log(`Testing: ${healthUrl}`);
    
    const req = protocol.get(healthUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS: ${url} is responding`);
          console.log(`   Response: ${data}\n`);
          resolve({ url, success: true, data });
        } else {
          console.log(`❌ FAILED: ${url} returned status ${res.statusCode}\n`);
          resolve({ url, success: false });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ FAILED: ${url} - ${error.message}\n`);
      resolve({ url, success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ TIMEOUT: ${url}\n`);
      resolve({ url, success: false, error: 'Timeout' });
    });
  });
}

async function testGitHubEndpoint(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const githubUrl = `${url}/api/github/repos`;
    
    console.log(`Testing GitHub endpoint: ${githubUrl}`);
    
    const req = protocol.get(githubUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`✅ GitHub API working: Found ${json.repos?.length || 0} repositories\n`);
            resolve({ success: true, repos: json.repos?.length || 0 });
          } catch (e) {
            console.log(`❌ GitHub API returned invalid JSON\n`);
            resolve({ success: false });
          }
        } else {
          console.log(`❌ GitHub API returned status ${res.statusCode}\n`);
          resolve({ success: false });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ GitHub API error: ${error.message}\n`);
      resolve({ success: false });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ GitHub API timeout\n`);
      resolve({ success: false });
    });
  });
}

async function main() {
  console.log('Step 1: Testing backend health endpoints...\n');
  
  const results = [];
  for (const url of backendUrls) {
    const result = await testUrl(url);
    results.push(result);
  }
  
  const workingBackend = results.find(r => r.success);
  
  if (workingBackend) {
    console.log('========================================');
    console.log('  Working Backend Found!');
    console.log('========================================\n');
    console.log(`Backend URL: ${workingBackend.url}\n`);
    
    console.log('Step 2: Testing GitHub API endpoint...\n');
    await testGitHubEndpoint(workingBackend.url);
    
    console.log('========================================');
    console.log('  Configuration Instructions');
    console.log('========================================\n');
    
    console.log('1. Update Vercel Environment Variable:');
    console.log(`   NEXT_PUBLIC_BACKEND_URL = ${workingBackend.url}\n`);
    
    console.log('2. Update Backend Environment Variables:');
    console.log('   GITHUB_USERNAME = lewisgathaiya');
    console.log('   EMAIL_SERVICE = gmail');
    console.log('   EMAIL_USER = gathaiyalewis1122@gmail.com');
    console.log('   EMAIL_PASS = [your-gmail-app-password]');
    console.log('   ADMIN_EMAIL = gathaiyalewis1122@gmail.com\n');
    
    console.log('3. Run this command to update Vercel:');
    console.log(`   vercel env add NEXT_PUBLIC_BACKEND_URL production`);
    console.log(`   Then enter: ${workingBackend.url}\n`);
    
  } else {
    console.log('========================================');
    console.log('  ❌ No Working Backend Found');
    console.log('========================================\n');
    console.log('Your backend is not responding. Please:');
    console.log('1. Check if your backend is deployed');
    console.log('2. Check backend logs for errors');
    console.log('3. Verify MongoDB connection');
    console.log('4. Redeploy your backend if needed\n');
  }
}

main().catch(console.error);
