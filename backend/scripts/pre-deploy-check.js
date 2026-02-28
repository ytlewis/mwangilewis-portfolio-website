#!/usr/bin/env node

/**
 * Pre-Deployment Check Script
 * 
 * This script checks for common deployment issues before deploying
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running Pre-Deployment Checks...\n');

let issues = [];
let warnings = [];
let passed = 0;

// Check 1: package.json exists
function checkPackageJson() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packagePath)) {
    console.log('✅ package.json exists');
    passed++;
    
    // Check for required dependencies
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredDeps = ['express', 'mongoose', 'dotenv', 'cors', 'helmet'];
    const missingDeps = requiredDeps.filter(dep => !pkg.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      issues.push(`Missing required dependencies: ${missingDeps.join(', ')}`);
    } else {
      console.log('✅ All required dependencies present');
      passed++;
    }
    
    // Check start script
    if (pkg.scripts && pkg.scripts.start) {
      console.log('✅ Start script defined');
      passed++;
    } else {
      issues.push('No start script defined in package.json');
    }
  } else {
    issues.push('package.json not found');
  }
}

// Check 2: server.js exists
function checkServerJs() {
  const serverPath = path.join(__dirname, '..', 'server.js');
  if (fs.existsSync(serverPath)) {
    console.log('✅ server.js exists');
    passed++;
  } else {
    issues.push('server.js not found');
  }
}

// Check 3: .env.example exists
function checkEnvExample() {
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(envExamplePath)) {
    console.log('✅ .env.example exists');
    passed++;
  } else {
    warnings.push('.env.example not found (recommended for documentation)');
  }
}

// Check 4: Models directory exists
function checkModels() {
  const modelsPath = path.join(__dirname, '..', 'models');
  if (fs.existsSync(modelsPath)) {
    console.log('✅ models directory exists');
    passed++;
    
    // Check for required models
    const requiredModels = ['Contact.js', 'Admin.js'];
    const existingModels = fs.readdirSync(modelsPath);
    const missingModels = requiredModels.filter(model => !existingModels.includes(model));
    
    if (missingModels.length > 0) {
      issues.push(`Missing required models: ${missingModels.join(', ')}`);
    } else {
      console.log('✅ All required models present');
      passed++;
    }
  } else {
    issues.push('models directory not found');
  }
}

// Check 5: Routes directory exists
function checkRoutes() {
  const routesPath = path.join(__dirname, '..', 'routes');
  if (fs.existsSync(routesPath)) {
    console.log('✅ routes directory exists');
    passed++;
    
    // Check for required routes
    const requiredRoutes = ['contact.js', 'auth.js', 'admin.js'];
    const existingRoutes = fs.readdirSync(routesPath);
    const missingRoutes = requiredRoutes.filter(route => !existingRoutes.includes(route));
    
    if (missingRoutes.length > 0) {
      issues.push(`Missing required routes: ${missingRoutes.join(', ')}`);
    } else {
      console.log('✅ All required routes present');
      passed++;
    }
  } else {
    issues.push('routes directory not found');
  }
}

// Check 6: Environment variables documentation
function checkEnvVars() {
  console.log('\n📋 Required Environment Variables:');
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'FRONTEND_URL',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];
  
  requiredVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n⚠️  Make sure to set these in your deployment platform!');
  passed++;
}

// Check 7: Port configuration
function checkPortConfig() {
  const serverPath = path.join(__dirname, '..', 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('process.env.PORT')) {
    console.log('✅ PORT environment variable configured');
    passed++;
  } else {
    warnings.push('PORT should use process.env.PORT for deployment platforms');
  }
}

// Check 8: CORS configuration
function checkCORS() {
  const serverPath = path.join(__dirname, '..', 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('cors')) {
    console.log('✅ CORS configured');
    passed++;
  } else {
    issues.push('CORS not configured - frontend requests will fail');
  }
}

// Check 9: Security headers
function checkSecurityHeaders() {
  const serverPath = path.join(__dirname, '..', 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('helmet')) {
    console.log('✅ Security headers (Helmet) configured');
    passed++;
  } else {
    warnings.push('Helmet.js not configured - consider adding security headers');
  }
}

// Check 10: Database connection
function checkDatabaseConfig() {
  const serverPath = path.join(__dirname, '..', 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('mongoose.connect') || serverContent.includes('connectDatabase')) {
    console.log('✅ Database connection configured');
    passed++;
  } else {
    issues.push('Database connection not configured');
  }
}

// Run all checks
function runChecks() {
  checkPackageJson();
  checkServerJs();
  checkEnvExample();
  checkModels();
  checkRoutes();
  checkEnvVars();
  checkPortConfig();
  checkCORS();
  checkSecurityHeaders();
  checkDatabaseConfig();
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Pre-Deployment Check Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warnings.length}`);
  console.log(`   ❌ Issues: ${issues.length}`);
  console.log('='.repeat(60));
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
  }
  
  if (issues.length > 0) {
    console.log('\n❌ Issues that must be fixed:');
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    console.log('\n❌ Please fix these issues before deploying!');
    process.exit(1);
  } else {
    console.log('\n🎉 All checks passed! Ready to deploy!');
    console.log('\n📝 Next steps:');
    console.log('   1. Choose a deployment platform (Railway or Render)');
    console.log('   2. Set environment variables on the platform');
    console.log('   3. Deploy the backend');
    console.log('   4. Update NEXT_PUBLIC_BACKEND_URL in Vercel');
    console.log('   5. Test the deployment');
    console.log('\n📖 See DEPLOY_BACKEND_NOW.md for detailed instructions');
    process.exit(0);
  }
}

// Run the checks
try {
  runChecks();
} catch (error) {
  console.error('\n❌ Pre-deployment check failed:', error.message);
  process.exit(1);
}
