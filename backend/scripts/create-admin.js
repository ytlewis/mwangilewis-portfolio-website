const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;
    const adminsCollection = db.collection('admins');

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({ 
      email: 'gathaiyalewis1122@gmail.com' 
    });

    if (existingAdmin) {
      console.log('\nℹ️  Admin user already exists');
      console.log('Email: gathaiyalewis1122@gmail.com');
      console.log('\nTo reset password, delete the existing admin and run this script again.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Get password from command line or use default
    const password = process.argv[2];
    
    if (!password) {
      console.error('\n❌ Error: Password is required');
      console.log('\nUsage: node create-admin.js "YourSecurePassword123!"');
      console.log('\nExample: node create-admin.js "MyStr0ngP@ssw0rd!"');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Validate password strength
    if (password.length < 8) {
      console.error('\n❌ Error: Password must be at least 8 characters long');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Hash password
    console.log('\nHashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    console.log('Creating admin user...');
    await adminsCollection.insertOne({
      email: 'gathaiyalewis1122@gmail.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📧 Email: gathaiyalewis1122@gmail.com');
    console.log('🔑 Password: [The password you provided]');
    console.log('\n⚠️  IMPORTANT: Keep your password secure and change it after first login!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Admin creation failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();
