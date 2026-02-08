const mongoose = require('mongoose');
require('dotenv').config();

async function createIndexes() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;

    console.log('\nCreating indexes for contacts collection...');
    
    // Contacts collection indexes
    await db.collection('contacts').createIndex({ email: 1 });
    console.log('✅ Created email index');
    
    await db.collection('contacts').createIndex({ createdAt: -1 });
    console.log('✅ Created createdAt index');
    
    await db.collection('contacts').createIndex({ read: 1 });
    console.log('✅ Created read status index');

    console.log('\nCreating indexes for admins collection...');
    
    // Admins collection indexes
    await db.collection('admins').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique email index');

    console.log('\n✅ All indexes created successfully!');
    
    // List all indexes
    console.log('\nVerifying indexes...');
    const contactIndexes = await db.collection('contacts').indexes();
    console.log('\nContacts collection indexes:');
    contactIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    const adminIndexes = await db.collection('admins').indexes();
    console.log('\nAdmins collection indexes:');
    adminIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Index creation failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createIndexes();
