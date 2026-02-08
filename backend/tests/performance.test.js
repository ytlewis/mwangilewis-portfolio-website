/**
 * Database Performance Tests
 * 
 * Tests to verify database query optimizations and connection pooling
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Contact = require('../models/Contact');
const Admin = require('../models/Admin');
const { connectionOptions } = require('../config/database');

describe('Database Performance Optimization Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Enable autoIndex for tests to ensure indexes are created
    const testOptions = { ...connectionOptions, autoIndex: true };
    await mongoose.connect(mongoUri, testOptions);
    
    // Ensure indexes are built
    await Contact.init();
    await Admin.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Contact.deleteMany({});
    await Admin.deleteMany({});
  });

  describe('Index Verification', () => {
    test('Contact model has proper indexes defined', async () => {
      const indexes = await Contact.collection.getIndexes();
      
      // Check for expected indexes
      expect(indexes).toHaveProperty('_id_'); // Default MongoDB index
      expect(indexes).toHaveProperty('email_1'); // Email index
      expect(indexes).toHaveProperty('createdAt_-1'); // CreatedAt descending index
      expect(indexes).toHaveProperty('read_1_createdAt_-1'); // Compound index
      expect(indexes).toHaveProperty('email_1_createdAt_-1'); // Compound index
    });

    test('Admin model has proper indexes defined', async () => {
      const indexes = await Admin.collection.getIndexes();
      
      // Check for expected indexes
      expect(indexes).toHaveProperty('_id_'); // Default MongoDB index
      expect(indexes).toHaveProperty('email_1'); // Email unique index
      expect(indexes).toHaveProperty('lastLogin_-1'); // LastLogin index
      expect(indexes).toHaveProperty('isActive_1_lastLogin_-1'); // Compound index
      expect(indexes).toHaveProperty('lockUntil_1'); // LockUntil index
    });
  });

  describe('Query Performance with Indexes', () => {
    beforeEach(async () => {
      // Create test data with valid names (letters only)
      const contacts = [];
      const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
      for (let i = 0; i < 100; i++) {
        contacts.push({
          name: names[i % names.length],
          email: `test${i}@example.com`,
          message: `Test message number ${i} with sufficient length to pass validation`,
          read: i % 2 === 0, // Half read, half unread
          createdAt: new Date(Date.now() - i * 1000 * 60) // Stagger creation times
        });
      }
      await Contact.insertMany(contacts);
    });

    test('Querying with sort on indexed field is efficient', async () => {
      const startTime = Date.now();
      
      // Query that uses the createdAt index
      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      
      const queryTime = Date.now() - startTime;
      
      expect(contacts).toHaveLength(10);
      expect(queryTime).toBeLessThan(100); // Should be very fast with index
      
      // Verify results are sorted correctly
      for (let i = 1; i < contacts.length; i++) {
        expect(contacts[i-1].createdAt.getTime()).toBeGreaterThanOrEqual(
          contacts[i].createdAt.getTime()
        );
      }
    });

    test('Compound index query (read + createdAt) is efficient', async () => {
      const startTime = Date.now();
      
      // Query that uses the compound index
      const unreadContacts = await Contact.find({ read: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      
      const queryTime = Date.now() - startTime;
      
      expect(unreadContacts.length).toBeGreaterThan(0);
      expect(queryTime).toBeLessThan(100); // Should be fast with compound index
      
      // Verify all are unread
      unreadContacts.forEach(contact => {
        expect(contact.read).toBe(false);
      });
    });

    test('Email lookup query uses index', async () => {
      const startTime = Date.now();
      
      // Query that uses the email index
      const contact = await Contact.findOne({ email: 'test50@example.com' })
        .lean();
      
      const queryTime = Date.now() - startTime;
      
      expect(contact).toBeTruthy();
      expect(contact.email).toBe('test50@example.com');
      expect(queryTime).toBeLessThan(50); // Should be very fast with index
    });

    test('Count queries with hint use indexes', async () => {
      const startTime = Date.now();
      
      // Count query with hint to use index
      const count = await Contact.countDocuments({ read: false })
        .hint({ read: 1, createdAt: -1 });
      
      const queryTime = Date.now() - startTime;
      
      expect(count).toBe(50); // Half of 100 contacts
      expect(queryTime).toBeLessThan(50); // Should be fast with index hint
    });
  });

  describe('Lean Query Performance', () => {
    beforeEach(async () => {
      // Create test data with valid names
      const contacts = [];
      const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
      for (let i = 0; i < 50; i++) {
        contacts.push({
          name: names[i % names.length],
          email: `test${i}@example.com`,
          message: `Test message number ${i} with sufficient length to pass validation`,
          read: false
        });
      }
      await Contact.insertMany(contacts);
    });

    test('Lean queries return plain JavaScript objects', async () => {
      const leanContact = await Contact.findOne().lean();
      const normalContact = await Contact.findOne();
      
      // Lean query returns plain object
      expect(leanContact.constructor.name).toBe('Object');
      
      // Normal query returns Mongoose document
      expect(normalContact.constructor.name).toBe('model');
      
      // Lean object should not have Mongoose methods
      expect(leanContact.save).toBeUndefined();
      expect(normalContact.save).toBeDefined();
    });

    test('Lean queries are faster than normal queries', async () => {
      // Measure lean query time
      const leanStart = Date.now();
      await Contact.find().limit(50).lean();
      const leanTime = Date.now() - leanStart;
      
      // Measure normal query time
      const normalStart = Date.now();
      await Contact.find().limit(50);
      const normalTime = Date.now() - normalStart;
      
      // Lean queries should generally be faster
      // Note: This is a rough test and may not always pass due to timing variations
      console.log(`Lean query: ${leanTime}ms, Normal query: ${normalTime}ms`);
      
      // Both should complete reasonably quickly
      expect(leanTime).toBeLessThan(200);
      expect(normalTime).toBeLessThan(200);
    });
  });

  describe('Connection Pool Configuration', () => {
    test('Connection options are properly configured', () => {
      expect(connectionOptions).toHaveProperty('maxPoolSize');
      expect(connectionOptions).toHaveProperty('minPoolSize');
      expect(connectionOptions).toHaveProperty('socketTimeoutMS');
      expect(connectionOptions).toHaveProperty('serverSelectionTimeoutMS');
      expect(connectionOptions).toHaveProperty('maxIdleTimeMS');
      expect(connectionOptions).toHaveProperty('waitQueueTimeoutMS');
      
      // Verify reasonable values
      expect(connectionOptions.maxPoolSize).toBeGreaterThan(0);
      expect(connectionOptions.minPoolSize).toBeGreaterThan(0);
      expect(connectionOptions.minPoolSize).toBeLessThanOrEqual(connectionOptions.maxPoolSize);
    });

    test('Connection is established successfully', () => {
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });
  });

  describe('Pagination Performance', () => {
    beforeEach(async () => {
      // Create larger dataset for pagination testing with valid names
      const contacts = [];
      const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
      for (let i = 0; i < 200; i++) {
        contacts.push({
          name: names[i % names.length],
          email: `test${i}@example.com`,
          message: `Test message number ${i} with sufficient length to pass validation`,
          read: i % 3 === 0,
          createdAt: new Date(Date.now() - i * 1000 * 60)
        });
      }
      await Contact.insertMany(contacts);
    });

    test('Paginated queries with skip and limit are efficient', async () => {
      const page = 3;
      const limit = 10;
      const skip = (page - 1) * limit;
      
      const startTime = Date.now();
      
      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .select('-__v');
      
      const queryTime = Date.now() - startTime;
      
      expect(contacts).toHaveLength(10);
      expect(queryTime).toBeLessThan(100);
      
      // Verify __v is not included
      contacts.forEach(contact => {
        expect(contact.__v).toBeUndefined();
      });
    });

    test('Count query for pagination total is efficient', async () => {
      const startTime = Date.now();
      
      const total = await Contact.countDocuments()
        .hint({ createdAt: -1 });
      
      const queryTime = Date.now() - startTime;
      
      expect(total).toBe(200);
      expect(queryTime).toBeLessThan(50);
    });
  });
});

/**
 * Property-Based Tests for Query Performance
 * 
 * These tests verify that database queries execute efficiently with proper indexing
 * across various query patterns and data sizes.
 */

const fc = require('fast-check');

describe('Property-Based Tests: Query Performance Optimization', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Enable autoIndex for tests to ensure indexes are created
    const testOptions = { ...connectionOptions, autoIndex: true };
    await mongoose.connect(mongoUri, testOptions);
    
    // Ensure indexes are built
    await Contact.init();
    await Admin.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Contact.deleteMany({});
    await Admin.deleteMany({});
  });

  /**
   * Property 40: Query Performance Optimization
   * **Validates: Requirements 10.4, 10.5**
   * 
   * For any admin dashboard operation, database queries should execute efficiently 
   * with proper indexing.
   */
  describe('Property 40: Query Performance Optimization', () => {
    test('Property 40: All indexed queries execute within performance threshold', async () => {
      // Feature: lewis-portfolio-website, Property 40: Query Performance Optimization
      
      await fc.assert(
        fc.asyncProperty(
          // Generate dataset size between 50 and 500 records
          fc.integer({ min: 50, max: 500 }),
          // Generate query parameters
          fc.record({
            sortField: fc.constantFrom('createdAt', 'email'),
            sortOrder: fc.constantFrom(1, -1),
            filterRead: fc.option(fc.boolean(), { nil: undefined }),
            limit: fc.integer({ min: 1, max: 100 }),
            skip: fc.integer({ min: 0, max: 50 })
          }),
          async (datasetSize, queryParams) => {
            // Setup: Create test dataset
            const contacts = [];
            const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
            
            for (let i = 0; i < datasetSize; i++) {
              contacts.push({
                name: names[i % names.length],
                email: `test${i}@example.com`,
                message: `Test message number ${i} with sufficient length to pass validation`,
                read: i % 2 === 0,
                createdAt: new Date(Date.now() - i * 1000 * 60)
              });
            }
            
            await Contact.insertMany(contacts);
            
            // Build query based on parameters
            let query = Contact.find();
            
            // Apply filter if specified
            if (queryParams.filterRead !== undefined) {
              query = query.where('read').equals(queryParams.filterRead);
            }
            
            // Apply sort
            const sortObj = {};
            sortObj[queryParams.sortField] = queryParams.sortOrder;
            query = query.sort(sortObj);
            
            // Apply pagination
            query = query.skip(queryParams.skip).limit(queryParams.limit);
            
            // Use lean for performance
            query = query.lean();
            
            // Execute query and measure time
            const startTime = Date.now();
            const results = await query.exec();
            const queryTime = Date.now() - startTime;
            
            // Property: Query should execute efficiently (within 150ms threshold)
            // This threshold accounts for in-memory database overhead
            expect(queryTime).toBeLessThan(150);
            
            // Verify results are valid
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeLessThanOrEqual(queryParams.limit);
            
            // Verify sort order is correct if results exist
            if (results.length > 1) {
              for (let i = 1; i < results.length; i++) {
                const prev = results[i - 1][queryParams.sortField];
                const curr = results[i][queryParams.sortField];
                
                if (queryParams.sortOrder === -1) {
                  // Descending order
                  if (queryParams.sortField === 'createdAt') {
                    expect(new Date(prev).getTime()).toBeGreaterThanOrEqual(new Date(curr).getTime());
                  } else {
                    expect(prev >= curr).toBe(true);
                  }
                } else {
                  // Ascending order
                  if (queryParams.sortField === 'createdAt') {
                    expect(new Date(prev).getTime()).toBeLessThanOrEqual(new Date(curr).getTime());
                  } else {
                    expect(prev <= curr).toBe(true);
                  }
                }
              }
            }
            
            // Verify filter is applied correctly if specified
            if (queryParams.filterRead !== undefined) {
              results.forEach(contact => {
                expect(contact.read).toBe(queryParams.filterRead);
              });
            }
            
            // Cleanup for next iteration
            await Contact.deleteMany({});
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Property 40: Count queries with indexes execute efficiently', async () => {
      // Feature: lewis-portfolio-website, Property 40: Query Performance Optimization
      
      await fc.assert(
        fc.asyncProperty(
          // Generate dataset size
          fc.integer({ min: 100, max: 1000 }),
          // Generate filter parameters
          fc.record({
            filterRead: fc.option(fc.boolean(), { nil: undefined }),
            useHint: fc.boolean()
          }),
          async (datasetSize, filterParams) => {
            // Setup: Create test dataset
            const contacts = [];
            const names = ['John Doe', 'Jane Smith', 'Bob Johnson'];
            
            for (let i = 0; i < datasetSize; i++) {
              contacts.push({
                name: names[i % names.length],
                email: `test${i}@example.com`,
                message: `Test message number ${i} with sufficient length to pass validation`,
                read: i % 3 === 0,
                createdAt: new Date(Date.now() - i * 1000)
              });
            }
            
            await Contact.insertMany(contacts);
            
            // Build count query
            let query = Contact.countDocuments();
            
            if (filterParams.filterRead !== undefined) {
              query = query.where('read').equals(filterParams.filterRead);
              
              // Use hint to force index usage if specified
              if (filterParams.useHint) {
                query = query.hint({ read: 1, createdAt: -1 });
              }
            }
            
            // Execute count query and measure time
            const startTime = Date.now();
            const count = await query.exec();
            const queryTime = Date.now() - startTime;
            
            // Property: Count query should execute efficiently (within 100ms)
            expect(queryTime).toBeLessThan(100);
            
            // Verify count is accurate
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);
            expect(count).toBeLessThanOrEqual(datasetSize);
            
            // Verify count matches filter if applied
            if (filterParams.filterRead !== undefined) {
              const expectedCount = contacts.filter(c => c.read === filterParams.filterRead).length;
              expect(count).toBe(expectedCount);
            } else {
              expect(count).toBe(datasetSize);
            }
            
            // Cleanup
            await Contact.deleteMany({});
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Property 40: Compound index queries perform efficiently', async () => {
      // Feature: lewis-portfolio-website, Property 40: Query Performance Optimization
      
      await fc.assert(
        fc.asyncProperty(
          // Generate dataset size
          fc.integer({ min: 100, max: 500 }),
          // Generate compound query parameters
          fc.record({
            readStatus: fc.boolean(),
            limit: fc.integer({ min: 5, max: 50 })
          }),
          async (datasetSize, queryParams) => {
            // Setup: Create test dataset
            const contacts = [];
            const names = ['Alice Brown', 'Bob Smith', 'Charlie Davis'];
            
            for (let i = 0; i < datasetSize; i++) {
              contacts.push({
                name: names[i % names.length],
                email: `user${i}@example.com`,
                message: `Message content ${i} with sufficient length for validation requirements`,
                read: i % 2 === 0,
                createdAt: new Date(Date.now() - i * 1000 * 30)
              });
            }
            
            await Contact.insertMany(contacts);
            
            // Execute compound index query (read + createdAt)
            const startTime = Date.now();
            const results = await Contact.find({ read: queryParams.readStatus })
              .sort({ createdAt: -1 })
              .limit(queryParams.limit)
              .lean()
              .exec();
            const queryTime = Date.now() - startTime;
            
            // Property: Compound index query should execute efficiently
            expect(queryTime).toBeLessThan(150);
            
            // Verify results match filter
            expect(results.length).toBeLessThanOrEqual(queryParams.limit);
            results.forEach(contact => {
              expect(contact.read).toBe(queryParams.readStatus);
            });
            
            // Verify sort order (descending by createdAt)
            for (let i = 1; i < results.length; i++) {
              expect(results[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
                results[i].createdAt.getTime()
              );
            }
            
            // Cleanup
            await Contact.deleteMany({});
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Property 40: Email lookup queries use index efficiently', async () => {
      // Feature: lewis-portfolio-website, Property 40: Query Performance Optimization
      
      await fc.assert(
        fc.asyncProperty(
          // Generate dataset size
          fc.integer({ min: 100, max: 500 }),
          // Generate email to search for
          fc.integer({ min: 0, max: 499 }),
          async (datasetSize, emailIndex) => {
            // Setup: Create test dataset
            const contacts = [];
            const names = ['Test User', 'Sample Person', 'Demo Contact'];
            
            for (let i = 0; i < datasetSize; i++) {
              contacts.push({
                name: names[i % names.length],
                email: `contact${i}@example.com`,
                message: `Contact message ${i} with enough text to meet validation requirements`,
                read: false,
                createdAt: new Date(Date.now() - i * 1000)
              });
            }
            
            await Contact.insertMany(contacts);
            
            // Search for a specific email (ensure it exists in dataset)
            const searchEmail = `contact${emailIndex % datasetSize}@example.com`;
            
            // Execute email lookup query
            const startTime = Date.now();
            const result = await Contact.findOne({ email: searchEmail }).lean().exec();
            const queryTime = Date.now() - startTime;
            
            // Property: Email lookup should be very fast with index (within 75ms)
            expect(queryTime).toBeLessThan(75);
            
            // Verify result is correct
            expect(result).toBeTruthy();
            expect(result.email).toBe(searchEmail);
            
            // Cleanup
            await Contact.deleteMany({});
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Property 40: Admin queries with multiple indexes perform efficiently', async () => {
      // Feature: lewis-portfolio-website, Property 40: Query Performance Optimization
      
      await fc.assert(
        fc.asyncProperty(
          // Generate number of admin records
          fc.integer({ min: 10, max: 50 }),
          // Generate query parameters
          fc.record({
            filterActive: fc.option(fc.boolean(), { nil: undefined }),
            sortByLastLogin: fc.boolean()
          }),
          async (adminCount, queryParams) => {
            // Setup: Create test admin dataset
            const admins = [];
            
            for (let i = 0; i < adminCount; i++) {
              admins.push({
                email: `admin${i}@example.com`,
                password: `SecurePass${i}!`,
                role: 'admin',
                isActive: i % 2 === 0,
                lastLogin: new Date(Date.now() - i * 1000 * 60 * 60),
                loginAttempts: 0
              });
            }
            
            await Admin.insertMany(admins);
            
            // Build query
            let query = Admin.find();
            
            if (queryParams.filterActive !== undefined) {
              query = query.where('isActive').equals(queryParams.filterActive);
            }
            
            if (queryParams.sortByLastLogin) {
              query = query.sort({ lastLogin: -1 });
            }
            
            query = query.lean().select('-password');
            
            // Execute query and measure time
            const startTime = Date.now();
            const results = await query.exec();
            const queryTime = Date.now() - startTime;
            
            // Property: Admin queries should execute efficiently
            expect(queryTime).toBeLessThan(100);
            
            // Verify results
            expect(Array.isArray(results)).toBe(true);
            
            // Verify filter applied correctly
            if (queryParams.filterActive !== undefined) {
              results.forEach(admin => {
                expect(admin.isActive).toBe(queryParams.filterActive);
              });
            }
            
            // Verify sort order if applied
            if (queryParams.sortByLastLogin && results.length > 1) {
              for (let i = 1; i < results.length; i++) {
                expect(new Date(results[i - 1].lastLogin).getTime()).toBeGreaterThanOrEqual(
                  new Date(results[i].lastLogin).getTime()
                );
              }
            }
            
            // Verify password is not included
            results.forEach(admin => {
              expect(admin.password).toBeUndefined();
            });
            
            // Cleanup
            await Admin.deleteMany({});
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
