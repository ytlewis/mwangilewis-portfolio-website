#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Lewis Portfolio Website setup...\n');

// Required files and directories
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'jest.config.js',
  '.gitignore',
  'README.md',
  'LICENSE',
  'vercel.json',
  '.env.local',
  'backend/package.json',
  'backend/server.js',
  'backend/.env.example',
  'backend/railway.json',
  'backend/render.yaml',
  'backend/Dockerfile',
  'backend/healthcheck.js'
];

const requiredDirectories = [
  'src',
  'src/app',
  'src/components',
  'src/lib',
  'src/locales',
  'backend',
  'backend/models',
  'backend/routes',
  'backend/services',
  'backend/middleware',
  'backend/tests'
];

let allValid = true;

// Check required files
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allValid = false;
  }
});

console.log('\n📂 Checking required directories:');
requiredDirectories.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING`);
    allValid = false;
  }
});

// Check package.json dependencies
console.log('\n📦 Checking key dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const backendPackageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  
  const frontendDeps = [
    'next', 'react', 'react-dom', 'typescript', 'tailwindcss',
    'three', 'gsap', 'framer-motion', 'i18next', 'react-i18next'
  ];
  
  const backendDeps = [
    'express', 'mongoose', 'bcrypt', 'jsonwebtoken', 'helmet',
    'cors', 'express-rate-limit', 'nodemailer', 'dotenv'
  ];
  
  frontendDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ Frontend: ${dep}`);
    } else {
      console.log(`❌ Frontend: ${dep} - MISSING`);
      allValid = false;
    }
  });
  
  backendDeps.forEach(dep => {
    if (backendPackageJson.dependencies[dep] || backendPackageJson.devDependencies[dep]) {
      console.log(`✅ Backend: ${dep}`);
    } else {
      console.log(`❌ Backend: ${dep} - MISSING`);
      allValid = false;
    }
  });
  
} catch (error) {
  console.log('❌ Error reading package.json files:', error.message);
  allValid = false;
}

// Check configuration files
console.log('\n⚙️  Checking configuration:');
try {
  const nextConfig = require('./next.config.js');
  console.log('✅ Next.js configuration loaded');
  
  const tailwindConfig = require('./tailwind.config.js');
  console.log('✅ Tailwind CSS configuration loaded');
  
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  console.log('✅ TypeScript configuration loaded');
  
} catch (error) {
  console.log('❌ Configuration error:', error.message);
  allValid = false;
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 All core infrastructure is properly configured!');
  console.log('\n📋 Next steps:');
  console.log('1. Configure backend/.env with your database and email settings');
  console.log('2. Start backend: cd backend && npm run dev');
  console.log('3. Start frontend: npm run dev');
  console.log('4. Visit http://localhost:3000');
} else {
  console.log('❌ Some components are missing or misconfigured.');
  console.log('Please review the errors above and fix them before proceeding.');
  process.exit(1);
}

console.log('\n🔧 Development tools:');
console.log('- Run tests: npm test (frontend) or cd backend && npm test (backend)');
console.log('- Build for production: npm run build');
console.log('- Lint code: npm run lint');
console.log('\n📚 See README.md for detailed setup instructions.');