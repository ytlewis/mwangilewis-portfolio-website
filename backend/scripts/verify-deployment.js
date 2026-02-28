#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that the backend is properly configured for deployment
 * and tests all critical endpoints.
 */

const axios = require('axios');

// Get backend URL from command line or use default
const BACKEND_URL = process.argv[2] || 'http://localhost:5000';

console.log('🔍 Verifying Backend Deployment...');
console.log(`📍 Backend URL: ${BACKEND_URL}\n`);

const tests = [];
let passedTests = 0;
let failedTests = 0;

// Test 1: Health Check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 5000
    });
    
    if (response.status === 200 && response.data.status === 'OK') {
      console.log('✅ Health Check: PASSED');
      passedTests++;
      return true;
    } else {
      console.log('❌ Health Check: FAILED - Invalid response');
      failedTests++;
      return false;
    }
  } catch (error) {
    console.log(`❌ Health Check: FAILED - ${error.message}`);
    failedTests++;
    return false;
  }
}

// Test 2: CORS Headers
async function testCORS() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      headers: {
        'Origin': 'https://lewisgathaiya.vercel.app'
      },
      timeout: 5000
    });
    
    const corsHeader = response.headers['access-control-allow-origin'];
    if (corsHeader) {
      console.log('✅ CORS Configuration: PASSED');
      passedTests++;
      return true;
    } else {
      console.log('❌ CORS Configuration: FAILED - No CORS headers');
      failedTests++;
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS Configuration: FAILED - ${error.message}`);
    failedTests++;
    return false;
  }
}

// Test 3: Security Headers
async function testSecurityHeaders() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 5000
    });
    
    const headers = response.headers;
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];
    
    const missingHeaders = requiredHeaders.filter(h => !headers[h]);
    
    if (missingHeaders.length === 0) {
      console.log('✅ Security Headers: PASSED');
      passedTests++;
      return true;
    } else {
      console.log(`❌ Security Headers: FAILED - Missing: ${missingHeaders.join(', ')}`);
      failedTests++;
      return false;
    }
  } catch (error) {
    console.log(`❌ Security Headers: FAILED - ${error.message}`);
    failedTests++;
    return false;
  }
}

// Test 4: Contact Endpoint
async function testContactEndpoint() {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/contact`, {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message from deployment verification'
    }, {
      timeout: 10000
    });
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ Contact Endpoint: PASSED');
      passedTests++;
      return true;
    } else {
      console.log('❌ Contact Endpoint: FAILED - Invalid response');
      failedTests++;
      return false;
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('⚠️  Contact Endpoint: RATE LIMITED (this is expected)');
      passedTests++;
      return true;
    }
    console.log(`❌ Contact Endpoint: FAILED - ${error.message}`);
    failedTests++;
    return false;
  }
}

// Test 5: GitHub Endpoint
async function testGitHubEndpoint() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/github/repos`, {
      timeout: 10000
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ GitHub Endpoint: PASSED');
      passedTests++;
      return true;
    } else {
      console.log('❌ GitHub Endpoint: FAILED - Invalid response');
      failedTests++;
      return false;
    }
  } catch (error) {
    console.log(`❌ GitHub Endpoint: FAILED - ${error.message}`);
    failedTests++;
    return false;
  }
}

// Test 6: Auth Endpoint
async function testAuthEndpoint() {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'wrongpassword'
    }, {
      timeout: 5000,
      validateStatus: () => true // Accept any status
    });
    
    // We expect this to fail with 401, which means the endpoint is working
    if (response.status === 401 || response.status === 400) {
      console.log('✅ Auth Endpoint: PASSED');
      passedTests++;
      return true;
    } else {
      console.log('❌ Auth Endpoint: FAILED - Unexpected response');
      failedTests++;
      return false;
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('⚠️  Auth Endpoint: RATE LIMITED (this is expected)');
      passedTests++;
      return true;
    }
    console.log(`❌ Auth Endpoint: FAILED - ${error.message}`);
    failedTests++;
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Running deployment verification tests...\n');
  
  await testHealthCheck();
  await testCORS();
  await testSecurityHeaders();
  await testContactEndpoint();
  await testGitHubEndpoint();
  await testAuthEndpoint();
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests} passed, ${failedTests} failed`);
  console.log('='.repeat(50));
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Backend is ready for production.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues before deploying.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
