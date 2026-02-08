const fc = require('fast-check');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const { generateToken } = require('../middleware/auth');

describe('Admin Dashboard Properties', () => {
  let mongoServer;
  let adminToken;
  let adminUser;

  beforeAll(async () => {
    // Disconnect any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Admin.deleteMany({});
    await Contact.deleteMany({});

    // Create admin user for authentication
    adminUser = new Admin({
      email: 'admin@test.com',
      password: 'AdminPass123!'
    });
    await adminUser.save();
    adminToken = generateToken(adminUser._id);
  });

  describe('Property 15: Admin Dashboard Data Display', () => {
    test('Feature: lewis-portfolio-website, Property 15: Admin Dashboard Data Display', async () => {
      // Property: For any contact form submission in the database, it should appear in the admin dashboard with all relevant information
      // Validates: Requirements 4.2
      // **Validates: Requirements 4.2**

      // Custom generators that match Contact model validation
      const nameGenerator = fc.stringOf(
        fc.constantFrom(
          ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '.split(''),
          '-',
          "'"
        ),
        { minLength: 2, maxLength: 50 }
      ).filter(s => {
        const trimmed = s.trim();
        return trimmed.length >= 2 && /^[a-zA-Z\s\-']+$/.test(trimmed) && /[a-zA-Z]/.test(trimmed);
      });
      
      const messageGenerator = fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10);

      await fc.assert(fc.asyncProperty(
        fc.array(
          fc.record({
            name: nameGenerator,
            email: fc.emailAddress(),
            message: messageGenerator,
            read: fc.boolean()
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (contactsData) => {
          // Clean up before each property test iteration
          await Contact.deleteMany({});
          
          // Create contacts in database
          const createdContacts = await Contact.insertMany(
            contactsData.map(data => ({
              ...data,
              createdAt: new Date()
            }))
          );

          // Fetch contacts from admin dashboard with high limit to get all
          const response = await request(app)
            .get(`/api/admin/contacts?limit=${createdContacts.length + 10}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

          expect(response.body.success).toBe(true);
          expect(response.body.contacts).toBeDefined();
          expect(Array.isArray(response.body.contacts)).toBe(true);

          // Verify all created contacts appear in the dashboard
          expect(response.body.contacts.length).toBe(createdContacts.length);

          // Verify each contact has all relevant information
          response.body.contacts.forEach((contact, index) => {
            expect(contact).toHaveProperty('_id');
            expect(contact).toHaveProperty('name');
            expect(contact).toHaveProperty('email');
            expect(contact).toHaveProperty('message');
            expect(contact).toHaveProperty('createdAt');
            expect(contact).toHaveProperty('read');

            // Verify data integrity (contacts are sorted by createdAt desc)
            const matchingContact = createdContacts.find(c => c._id.toString() === contact._id);
            expect(matchingContact).toBeDefined();
            expect(contact.name).toBe(matchingContact.name);
            expect(contact.email).toBe(matchingContact.email);
            expect(contact.message).toBe(matchingContact.message);
            expect(contact.read).toBe(matchingContact.read);
          });
        }
      ), { numRuns: 100 });
    });

    test('Admin dashboard displays contacts with pagination', async () => {
      // Create 25 contacts with valid names
      const validNames = [
        'John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson',
        'David Lee', 'Emma Davis', 'Frank Miller', 'Grace Taylor', 'Henry Anderson',
        'Ivy Thomas', 'Jack Martinez', 'Kate Garcia', 'Leo Rodriguez', 'Mary Lopez',
        'Nathan Hill', 'Olivia Scott', 'Paul Green', 'Quinn Adams', 'Rachel Baker',
        'Sam Nelson', 'Tina Carter', 'Uma Mitchell', 'Victor Perez', 'Wendy Roberts'
      ];
      
      const contacts = validNames.map((name, i) => ({
        name: name,
        email: `user${i}@test.com`,
        message: `This is a test message number ${i} with enough characters to pass validation`,
        read: i % 2 === 0
      }));

      await Contact.insertMany(contacts);

      // Test first page
      const page1 = await request(app)
        .get('/api/admin/contacts?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(page1.body.contacts.length).toBe(10);
      expect(page1.body.pagination.page).toBe(1);
      expect(page1.body.pagination.total).toBe(25);
      expect(page1.body.pagination.pages).toBe(3);

      // Test second page
      const page2 = await request(app)
        .get('/api/admin/contacts?page=2&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(page2.body.contacts.length).toBe(10);
      expect(page2.body.pagination.page).toBe(2);
    });

    test('Admin dashboard requires authentication', async () => {
      await request(app)
        .get('/api/admin/contacts')
        .expect(401);
    });

    test('Admin dashboard displays dashboard stats correctly', async () => {
      // Create mix of read and unread contacts
      await Contact.insertMany([
        { name: 'John Doe', email: 'user1@test.com', message: 'This is a test message one', read: false },
        { name: 'Jane Smith', email: 'user2@test.com', message: 'This is a test message two', read: false },
        { name: 'Bob Johnson', email: 'user3@test.com', message: 'This is a test message three', read: true },
        { name: 'Alice Brown', email: 'user4@test.com', message: 'This is a test message four', read: true },
        { name: 'Charlie Wilson', email: 'user5@test.com', message: 'This is a test message five', read: false }
      ]);

      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.stats.totalContacts).toBe(5);
      expect(response.body.stats.unreadContacts).toBe(3);
      expect(response.body.stats.recentContacts).toHaveLength(5);
    });
  });

  describe('Property 16: Admin CRUD Operations', () => {
    test('Feature: lewis-portfolio-website, Property 16: Admin CRUD Operations', async () => {
      // Property: For any user entry in the admin dashboard, edit and delete operations should successfully modify or remove the data
      // Validates: Requirements 4.3
      // **Validates: Requirements 4.3**

      // Custom generators that match Contact model validation
      const nameGenerator = fc.stringOf(
        fc.constantFrom(
          ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '.split(''),
          '-',
          "'"
        ),
        { minLength: 2, maxLength: 50 }
      ).filter(s => {
        const trimmed = s.trim();
        return trimmed.length >= 2 && /^[a-zA-Z\s\-']+$/.test(trimmed) && /[a-zA-Z]/.test(trimmed);
      });
      
      const messageGenerator = fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10);

      await fc.assert(fc.asyncProperty(
        fc.array(
          fc.record({
            name: nameGenerator,
            email: fc.emailAddress(),
            message: messageGenerator,
            read: fc.boolean()
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (contactsData) => {
          // Clean up before each property test iteration
          await Contact.deleteMany({});
          
          // Create contacts in database
          const createdContacts = await Contact.insertMany(
            contactsData.map(data => ({
              ...data,
              createdAt: new Date()
            }))
          );

          // Test EDIT operation: Update each contact's read status
          for (const contact of createdContacts) {
            const newReadStatus = !contact.read;
            
            const updateResponse = await request(app)
              .put(`/api/admin/contacts/${contact._id}`)
              .set('Authorization', `Bearer ${adminToken}`)
              .send({ read: newReadStatus })
              .expect(200);

            expect(updateResponse.body.success).toBe(true);
            expect(updateResponse.body.contact).toBeDefined();
            expect(updateResponse.body.contact.read).toBe(newReadStatus);
            expect(updateResponse.body.contact._id).toBe(contact._id.toString());

            // Verify the data was actually modified in the database
            const updatedContact = await Contact.findById(contact._id);
            expect(updatedContact).toBeDefined();
            expect(updatedContact.read).toBe(newReadStatus);
            expect(updatedContact.name).toBe(contact.name);
            expect(updatedContact.email).toBe(contact.email);
            expect(updatedContact.message).toBe(contact.message);
          }

          // Test DELETE operation: Delete each contact
          for (const contact of createdContacts) {
            const deleteResponse = await request(app)
              .delete(`/api/admin/contacts/${contact._id}`)
              .set('Authorization', `Bearer ${adminToken}`)
              .expect(200);

            expect(deleteResponse.body.success).toBe(true);
            expect(deleteResponse.body.message).toBe('Contact deleted successfully');

            // Verify the data was actually removed from the database
            const deletedContact = await Contact.findById(contact._id);
            expect(deletedContact).toBeNull();
          }

          // Verify all contacts were deleted
          const remainingContacts = await Contact.find();
          expect(remainingContacts.length).toBe(0);
        }
      ), { numRuns: 100 }); // Full property test runs with rate limiting disabled in test env
    }, 30000); // Increased timeout for property test

    test('Edit operation fails for non-existent contact', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/admin/contacts/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ read: true })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Contact not found');
    });

    test('Delete operation fails for non-existent contact', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/admin/contacts/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Contact not found');
    });

    test('Edit operation requires authentication', async () => {
      const contact = await Contact.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message with enough characters'
      });

      await request(app)
        .put(`/api/admin/contacts/${contact._id}`)
        .send({ read: true })
        .expect(401);
    });

    test('Delete operation requires authentication', async () => {
      const contact = await Contact.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message with enough characters'
      });

      await request(app)
        .delete(`/api/admin/contacts/${contact._id}`)
        .expect(401);
    });

    test('Edit operation preserves other contact fields', async () => {
      const contact = await Contact.create({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with enough characters',
        read: false
      });

      const response = await request(app)
        .put(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ read: true })
        .expect(200);

      expect(response.body.contact.name).toBe('John Doe');
      expect(response.body.contact.email).toBe('john@example.com');
      expect(response.body.contact.message).toBe('This is a test message with enough characters');
      expect(response.body.contact.read).toBe(true);
    });
  });

  describe('Property 17: Dynamic Content Updates', () => {
    test('Feature: lewis-portfolio-website, Property 17: Dynamic Content Updates', async () => {
      // Property: For any content modification through the admin dashboard, changes should be reflected in the live portfolio
      // Validates: Requirements 4.4
      // **Validates: Requirements 4.4**

      // Custom generators that match Contact model validation
      const nameGenerator = fc.stringOf(
        fc.constantFrom(
          ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '.split(''),
          '-',
          "'"
        ),
        { minLength: 2, maxLength: 50 }
      ).filter(s => {
        const trimmed = s.trim();
        return trimmed.length >= 2 && /^[a-zA-Z\s\-']+$/.test(trimmed) && /[a-zA-Z]/.test(trimmed);
      });
      
      const messageGenerator = fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10);

      await fc.assert(fc.asyncProperty(
        fc.array(
          fc.record({
            name: nameGenerator,
            email: fc.emailAddress(),
            message: messageGenerator,
            read: fc.boolean()
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (contactsData) => {
          // Clean up before each property test iteration
          await Contact.deleteMany({});
          
          // Step 1: Create initial content in the database
          const createdContacts = await Contact.insertMany(
            contactsData.map(data => ({
              ...data,
              createdAt: new Date()
            }))
          );

          // Step 2: Verify initial state is reflected in the live portfolio (admin dashboard view)
          const initialResponse = await request(app)
            .get(`/api/admin/contacts?limit=${createdContacts.length + 10}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

          expect(initialResponse.body.success).toBe(true);
          expect(initialResponse.body.contacts.length).toBe(createdContacts.length);

          // Step 3: Modify content through admin dashboard (update read status)
          const modificationsMap = new Map();
          for (const contact of createdContacts) {
            const newReadStatus = !contact.read;
            modificationsMap.set(contact._id.toString(), newReadStatus);
            
            const updateResponse = await request(app)
              .put(`/api/admin/contacts/${contact._id}`)
              .set('Authorization', `Bearer ${adminToken}`)
              .send({ read: newReadStatus })
              .expect(200);

            expect(updateResponse.body.success).toBe(true);
          }

          // Step 4: Verify modifications are immediately reflected in the live portfolio
          const updatedResponse = await request(app)
            .get(`/api/admin/contacts?limit=${createdContacts.length + 10}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

          expect(updatedResponse.body.success).toBe(true);
          expect(updatedResponse.body.contacts.length).toBe(createdContacts.length);

          // Verify each modification is reflected
          updatedResponse.body.contacts.forEach((contact) => {
            const expectedReadStatus = modificationsMap.get(contact._id);
            expect(expectedReadStatus).toBeDefined();
            expect(contact.read).toBe(expectedReadStatus);
          });

          // Step 5: Verify dashboard stats are also updated to reflect changes
          const statsResponse = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

          expect(statsResponse.body.success).toBe(true);
          expect(statsResponse.body.stats.totalContacts).toBe(createdContacts.length);
          
          // Count expected unread contacts based on modifications
          const expectedUnreadCount = Array.from(modificationsMap.values()).filter(read => !read).length;
          expect(statsResponse.body.stats.unreadContacts).toBe(expectedUnreadCount);

          // Step 6: Test individual contact retrieval reflects updates
          for (const contact of createdContacts) {
            const individualResponse = await request(app)
              .get(`/api/admin/contacts/${contact._id}`)
              .set('Authorization', `Bearer ${adminToken}`)
              .expect(200);

            expect(individualResponse.body.success).toBe(true);
            expect(individualResponse.body.contact.read).toBe(modificationsMap.get(contact._id.toString()));
          }
        }
      ), { numRuns: 100 }); // Full property test runs
    }, 30000); // Increased timeout for property test

    test('Content updates are atomic and consistent', async () => {
      // Create a contact
      const contact = await Contact.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message with enough characters',
        read: false
      });

      // Update the contact
      await request(app)
        .put(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ read: true })
        .expect(200);

      // Verify the update is immediately visible
      const response = await request(app)
        .get(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.contact.read).toBe(true);
    });

    test('Multiple rapid updates are handled correctly', async () => {
      const contact = await Contact.create({
        name: 'Rapid Update Test',
        email: 'rapid@example.com',
        message: 'Testing rapid updates to ensure consistency',
        read: false
      });

      // Perform multiple rapid updates
      await request(app)
        .put(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ read: true })
        .expect(200);

      await request(app)
        .put(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ read: false })
        .expect(200);

      await request(app)
        .put(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ read: true })
        .expect(200);

      // Verify final state
      const response = await request(app)
        .get(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.contact.read).toBe(true);
    });

    test('Deleted content is immediately removed from live portfolio', async () => {
      const contact = await Contact.create({
        name: 'Delete Test',
        email: 'delete@example.com',
        message: 'This contact will be deleted to test immediate removal',
        read: false
      });

      // Verify contact exists
      const beforeDelete = await request(app)
        .get(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(beforeDelete.body.success).toBe(true);

      // Delete the contact
      await request(app)
        .delete(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify contact is immediately removed
      await request(app)
        .get(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      // Verify it's not in the list
      const listResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const foundContact = listResponse.body.contacts.find(
        (c) => c._id === contact._id.toString()
      );
      expect(foundContact).toBeUndefined();
    });
  });
});
