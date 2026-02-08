const mongoose = require('mongoose');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Get database
    const db = mongoose.connection.db;

    // Create collections
    console.log('\nCreating collections...');
    
    try {
      await db.createCollection('contacts');
      console.log('✅ Created contacts collection');
    } catch (error) {
      if (error.code === 48) {
        console.log('ℹ️  Contacts collection already exists');
      } else {
        throw error;
      }
    }

    try {
      await db.createCollection('admins');
      console.log('✅ Created admins collection');
    } catch (error) {
      if (error.code === 48) {
        console.log('ℹ️  Admins collection already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Database setup complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

setupDatabase();
