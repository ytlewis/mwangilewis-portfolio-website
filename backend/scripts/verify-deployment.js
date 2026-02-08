const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://mwangilewis.com';
const BACKEND_URL = process.env.BACKEND_URL || 'https://api.mwangilewis.com';
const MONGODB_URI = process.env.MONGODB_URI;

let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Test functions
async function testDatabaseConnection() {
  log.section('Testing Database Connection');
  
  try {
    if (!MONGODB_URI) {
      log.error('MONGODB_URI not set in environment variables');
      testResults.failed++;
      return false;
    }

    log.info('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    log.success('Connected to MongoDB Atlas');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    log.info(`Database: ${db.databaseName}`);
    log.info(`Collections found: ${collections.length}`);
    
    const requiredCollections = ['contacts', 'admins'];
    const existingCollections = collections.map(c => c.name);
    
    for (const collection of requiredCollections) {
      if (existingCollections.includes(collection)) {
        log.success(`Collection '${collection}' exists`);
      } else {
        log.warning(`Collection '${collection}' not found (will be created on first use)`);
        testResults.warnings++;
      }
    }

    await mongoose.connection.close();
    testResults.passed++;
    return true;
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function testBackendHealth() {
  log.section('Testing Backend Health');
  
  try {
    log.info(`Testing: ${BACKEND_URL}/api/health`);
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 10000
    });

    if (response.status === 200 && response.data.status === 'OK') {
      log.success('Backend health check passed');
      log.info(`Response: ${JSON.stringify(response.data)}`);
      testResults.passed++;
      return true;
    } else {
      log.error('Backend health check returned unexpected response');
      testResults.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Backend health check failed: ${error.message}`);
    if (error.code === 'ENOTFOUND') {
      log.warning('Domain not resolving - check DNS configuration');
    }
    testResults.failed++;
    return false;
  }
}

async function testBackendCORS() {
  log.section('Testing Backend CORS Configuration');
  
  try {
    log.info('Testing CORS headers...');
    const response = await axios.options(`${BACKEND_URL}/api/health`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET'
      },
      timeout: 10000
    });

    const corsHeader = response.headers['access-control-allow-origin'];
    if (corsHeader) {
      log.success(`CORS configured: ${corsHeader}`);
      testResults.passed++;
      return true;
    } else {
      log.warning('CORS headers not found - may need configuration');
      testResults.warnings++;
      return false;
    }
  } catch (error) {
    log.warning(`CORS test inconclusive: ${error.message}`);
    testResults.warnings++;
    return false;
  }
}

async function testBackendSecurity() {
  log.section('Testing Backend Security Headers');
  
  try {
    log.info('Checking security headers...');
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 10000
    });

    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security'
    ];

    let foundHeaders = 0;
    for (const header of securityHeaders) {
      if (response.headers[header]) {
        log.success(`${header}: ${response.headers[header]}`);
        foundHeaders++;
      } else {
        log.warning(`${header} not found`);
      }
    }

    if (foundHeaders >= 3) {
      log.success('Security headers configured');
      testResults.passed++;
      return true;
    } else {
      log.warning('Some security headers missing');
      testResults.warnings++;
      return false;
    }
  } catch (error) {
    log.error(`Security headers test failed: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function testFrontendAccess() {
  log.section('Testing Frontend Access');
  
  try {
    log.info(`Testing: ${FRONTEND_URL}`);
    const response = await axios.get(FRONTEND_URL, {
      timeout: 10000,
      maxRedirects: 5
    });

    if (response.status === 200) {
      log.success('Frontend is accessible');
      
      // Check if it's actually HTML
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('text/html')) {
        log.success('Frontend serving HTML content');
      }

      testResults.passed++;
      return true;
    } else {
      log.error(`Frontend returned status: ${response.status}`);
      testResults.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Frontend access failed: ${error.message}`);
    if (error.code === 'ENOTFOUND') {
      log.warning('Domain not resolving - check DNS configuration');
    }
    testResults.failed++;
    return false;
  }
}

async function testFrontendSSL() {
  log.section('Testing Frontend SSL/HTTPS');
  
  try {
    log.info('Checking HTTPS configuration...');
    
    // Test HTTPS
    const httpsResponse = await axios.get(FRONTEND_URL, {
      timeout: 10000
    });

    if (httpsResponse.request.res.socket.encrypted) {
      log.success('HTTPS is enabled');
      testResults.passed++;
    } else {
      log.warning('HTTPS not detected');
      testResults.warnings++;
    }

    // Test HTTP redirect
    try {
      const httpUrl = FRONTEND_URL.replace('https://', 'http://');
      const httpResponse = await axios.get(httpUrl, {
        timeout: 10000,
        maxRedirects: 0,
        validateStatus: (status) => status === 301 || status === 302 || status === 308
      });

      if (httpResponse.status >= 300 && httpResponse.status < 400) {
        log.success('HTTP to HTTPS redirect configured');
      }
    } catch (error) {
      if (error.response && error.response.status >= 300 && error.response.status < 400) {
        log.success('HTTP to HTTPS redirect configured');
      } else {
        log.warning('HTTP redirect not detected');
        testResults.warnings++;
      }
    }

    return true;
  } catch (error) {
    log.error(`SSL test failed: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function testGitHubIntegration() {
  log.section('Testing GitHub Integration');
  
  try {
    log.info(`Testing: ${BACKEND_URL}/api/github/repos`);
    const response = await axios.get(`${BACKEND_URL}/api/github/repos`, {
      timeout: 15000
    });

    if (response.status === 200 && response.data.success) {
      log.success('GitHub integration working');
      log.info(`Repositories found: ${response.data.repos?.length || 0}`);
      testResults.passed++;
      return true;
    } else {
      log.warning('GitHub integration returned unexpected response');
      testResults.warnings++;
      return false;
    }
  } catch (error) {
    log.warning(`GitHub integration test failed: ${error.message}`);
    log.info('This is optional - site will work with cached data');
    testResults.warnings++;
    return false;
  }
}

async function testEmailConfiguration() {
  log.section('Testing Email Configuration');
  
  try {
    const requiredEnvVars = ['EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL'];
    let allSet = true;

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        log.success(`${envVar} is set`);
      } else {
        log.error(`${envVar} is not set`);
        allSet = false;
      }
    }

    if (allSet) {
      log.success('Email configuration complete');
      log.info('Note: Actual email sending can only be tested by submitting contact form');
      testResults.passed++;
      return true;
    } else {
      log.error('Email configuration incomplete');
      testResults.failed++;
      return false;
    }
  } catch (error) {
    log.error(`Email configuration test failed: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function testEnvironmentVariables() {
  log.section('Testing Environment Variables');
  
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL',
    'EMAIL_SERVICE',
    'EMAIL_USER',
    'EMAIL_PASS',
    'ADMIN_EMAIL'
  ];

  const optionalVars = [
    'GITHUB_TOKEN',
    'NODE_ENV',
    'PORT'
  ];

  let allRequired = true;

  log.info('Required variables:');
  for (const envVar of requiredVars) {
    if (process.env[envVar]) {
      log.success(`${envVar} ✓`);
    } else {
      log.error(`${envVar} ✗`);
      allRequired = false;
    }
  }

  log.info('\nOptional variables:');
  for (const envVar of optionalVars) {
    if (process.env[envVar]) {
      log.success(`${envVar} ✓`);
    } else {
      log.warning(`${envVar} not set (optional)`);
    }
  }

  if (allRequired) {
    testResults.passed++;
    return true;
  } else {
    testResults.failed++;
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        Lewis Portfolio Website - Deployment Verification   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);

  log.info(`Frontend URL: ${FRONTEND_URL}`);
  log.info(`Backend URL: ${BACKEND_URL}`);
  log.info(`Starting verification tests...\n`);

  // Run all tests
  await testEnvironmentVariables();
  await testDatabaseConnection();
  await testBackendHealth();
  await testBackendCORS();
  await testBackendSecurity();
  await testFrontendAccess();
  await testFrontendSSL();
  await testGitHubIntegration();
  await testEmailConfiguration();

  // Print summary
  log.section('Test Summary');
  
  const total = testResults.passed + testResults.failed + testResults.warnings;
  
  console.log(`${colors.green}Passed:   ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed:   ${testResults.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${testResults.warnings}${colors.reset}`);
  console.log(`Total:    ${total}\n`);

  if (testResults.failed === 0) {
    log.success('All critical tests passed! 🎉');
    log.info('Your deployment is ready for production!');
    
    if (testResults.warnings > 0) {
      log.warning(`You have ${testResults.warnings} warning(s) - review them above`);
    }
    
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log('1. Test the contact form manually');
    console.log('2. Login to admin dashboard');
    console.log('3. Set up monitoring and alerts');
    console.log('4. Configure backups');
    console.log('\nVisit your site: ' + FRONTEND_URL);
    
    process.exit(0);
  } else {
    log.error(`${testResults.failed} test(s) failed`);
    log.info('Please fix the issues above before going to production');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  log.error(`Verification failed: ${error.message}`);
  process.exit(1);
});
