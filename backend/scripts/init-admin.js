/**
 * Initialize Admin User Script
 * 
 * This script creates the initial admin user in the database.
 * Run this script once after setting up the database.
 * 
 * Usage: node backend/scripts/init-admin.js
 */

require('dotenv').config({ path: './backend/.env' });
const dns = require('dns');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

// Configure Google DNS to fix MongoDB Atlas connection
dns.setServers(['8.8.8.8', '8.8.4.4']);

const ADMIN_EMAIL = 'gathaiyalewis1122@gmail.com';
const ADMIN_PASSWORD = 'Lewis001!'; // Change this after first login!

async function initializeAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Created: ${existingAdmin.createdAt}`);
      console.log('\nIf you need to reset the password, delete the admin user first.');
      await mongoose.connection.close();
      return;
    }

    // Create new admin user
    console.log('\nCreating admin user...');
    const admin = new Admin({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    
    console.log('✓ Admin user created successfully!');
    console.log('\n=================================');
    console.log('Admin Login Credentials:');
    console.log('=================================');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('=================================');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('⚠️  Access the admin dashboard at: http://localhost:3000/admin');
    
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    
  } catch (error) {
    console.error('✗ Error initializing admin:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the initialization
initializeAdmin();
