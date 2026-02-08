const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fc = require('fast-check');
const app = require('../server');
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

// Mock email service to prevent actual emails during testing
jest.mock('../services/emailService', () => ({
  sendContactNotification: jest.fn().mockResolvedValue(true),
  sendAdminNotification: jest.fn().mockResolvedValue(true)
}));

describe('Contact System Property-Based Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    // Start in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    await mongoose.connect(mongoUri);
  }, 60000); // Increase timeout to 60 seconds

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    await Contact.deleteMany({});
    // Clear mock calls
    jest.clearAllMocks();
  });

  // Generators for valid test data
  const validNameGenerator = fc.string({ minLength: 2, maxLength: 100 })
    .filter(s => /^[a-zA-Z\s\-']+$/.test(s.trim()));

  const validMessageGenerator = fc.string({ minLength: 10, maxLength: 1000 })
    .filter(s => s.trim().length >= 10);

  describe('Property 18: Contact Form Data Capture', () => {
    test('Feature: lewis-portfolio-website, Property 18: Contact Form Data Capture - For any contact form submission with valid data, all fields (name, email, message) should be captured and stored', () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          name: validNameGenerator,
          email: fc.emailAddress(),
          message: validMessageGenerator
        }),
        async (contactData) => {
          // Submit contact form
          const response = await request(app)
            .post('/api/contact')
            .send(contactData)
            .expect(201);

          // Verify response structure
          expect(response.body.success).toBe(true);
          expect(response.body.message).toBe('Contact form submitted successfully');
          expect(response.body.id).toBeDefined();

          // Verify data was stored in database
          const storedContact = await Contact.findById(response.body.id);
          expect(storedContact).toBeTruthy();
          
          // Verify all fields were captured correctly
          expect(storedContact.name).toBe(contactData.name);
          expect(storedContact.email).toBe(contactData.email.toLowerCase());
          expect(storedContact.message).toBe(contactData.message);
          expect(storedContact.read).toBe(false); // Default value
          expect(storedContact.createdAt).toBeInstanceOf(Date);
          
          // Verify IP address is captured (will be ::ffff:127.0.0.1 in test environment)
          expect(storedContact.ipAddress).toBeDefined();
        }
      ), { numRuns: 100 });
    });

    test('Contact form validation rejects invalid data', () => {
      fc.assert(fc.asyncProperty(
        fc.oneof(
          // Invalid name (too short)
          fc.record({
            name: fc.constantFrom('', 'a'),
            email: fc.emailAddress(),
            message: validMessageGenerator
          }),
          // Invalid name (contains numbers/symbols)
          fc.record({
            name: fc.constantFrom('John123', 'Jane@Doe', 'Test$User'),
            email: fc.emailAddress(),
            message: validMessageGenerator
          }),
          // Invalid email
          fc.record({
            name: validNameGenerator,
            email: fc.constantFrom('invalid', 'no@', '@domain.com', 'test@'),
            message: validMessageGenerator
          }),
          // Invalid message (too short)
          fc.record({
            name: validNameGenerator,
            email: fc.emailAddress(),
            message: fc.string({ maxLength: 9 })
          }),
          // Invalid message (too long)
          fc.record({
            name: validNameGenerator,
            email: fc.emailAddress(),
            message: fc.string({ minLength: 1001, maxLength: 1500 })
          })
        ),
        async (invalidData) => {
          // Submit invalid contact form
          const response = await request(app)
            .post('/api/contact')
            .send(invalidData)
            .expect(400);

          // Verify error response
          expect(response.body.success).toBe(false);
          expect(response.body.message).toBe('Validation failed');
          expect(response.body.errors).toBeDefined();
          expect(Array.isArray(response.body.errors)).toBe(true);
          expect(response.body.errors.length).toBeGreaterThan(0);

          // Verify no data was stored
          const contactCount = await Contact.countDocuments();
          expect(contactCount).toBe(0);
        }
      ), { numRuns: 50 });
    });

    test('Contact form handles missing fields appropriately', () => {
      fc.assert(fc.asyncProperty(
        fc.oneof(
          // Missing name
          fc.record({
            email: fc.emailAddress(),
            message: validMessageGenerator
          }),
          // Missing email
          fc.record({
            name: validNameGenerator,
            message: validMessageGenerator
          }),
          // Missing message
          fc.record({
            name: validNameGenerator,
            email: fc.emailAddress()
          }),
          // Empty object
          fc.constant({})
        ),
        async (incompleteData) => {
          // Submit incomplete contact form
          const response = await request(app)
            .post('/api/contact')
            .send(incompleteData)
            .expect(400);

          // Verify error response
          expect(response.body.success).toBe(false);
          expect(response.body.message).toBe('Validation failed');
          expect(response.body.errors).toBeDefined();

          // Verify no data was stored
          const contactCount = await Contact.countDocuments();
          expect(contactCount).toBe(0);
        }
      ), { numRuns: 30 });
    });
  });

  describe('Contact Data Sanitization', () => {
    test('Contact form sanitizes input data properly', () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 })
            .map(s => `  ${s}  John Doe  `), // Add extra whitespace
          email: fc.emailAddress()
            .map(email => `  ${email.toUpperCase()}  `), // Add whitespace and uppercase
          message: validMessageGenerator
            .map(msg => `  ${msg}  `) // Add extra whitespace
        }),
        async (contactData) => {
          // Submit contact form with unsanitized data
          const response = await request(app)
            .post('/api/contact')
            .send(contactData)
            .expect(201);

          // Verify data was stored and sanitized
          const storedContact = await Contact.findById(response.body.id);
          
          // Verify name is trimmed and whitespace normalized
          expect(storedContact.name).toBe(contactData.name.replace(/\s+/g, ' ').trim());
          
          // Verify email is lowercase and trimmed
          expect(storedContact.email).toBe(contactData.email.trim().toLowerCase());
          
          // Verify message is trimmed
          expect(storedContact.message).toBe(contactData.message.trim());
        }
      ), { numRuns: 50 });
    });
  });

  describe('Property 19: Email Notification Delivery', () => {
    test('Feature: lewis-portfolio-website, Property 19: Email Notification Delivery - For any contact form submission, an email notification should be sent via the configured email service', () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          name: validNameGenerator,
          email: fc.emailAddress(),
          message: validMessageGenerator
        }),
        async (contactData) => {
          // Clear previous mock calls
          emailService.sendContactNotification.mockClear();

          // Submit contact form
          const response = await request(app)
            .post('/api/contact')
            .send(contactData)
            .expect(201);

          // Verify response is successful
          expect(response.body.success).toBe(true);

          // Wait a bit for async email sending to be triggered
          await new Promise(resolve => setTimeout(resolve, 100));

          // Verify email service was called
          expect(emailService.sendContactNotification).toHaveBeenCalledTimes(1);
          
          // Verify email service was called with correct data
          const emailCallArgs = emailService.sendContactNotification.mock.calls[0][0];
          expect(emailCallArgs.name).toBe(contactData.name);
          expect(emailCallArgs.email).toBe(contactData.email);
          expect(emailCallArgs.message).toBe(contactData.message);
        }
      ), { numRuns: 100 });
    });

    test('Email notification failure does not prevent contact form submission', () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          name: validNameGenerator,
          email: fc.emailAddress(),
          message: validMessageGenerator
        }),
        async (contactData) => {
          // Mock email service to fail
          emailService.sendContactNotification.mockResolvedValueOnce(false);

          // Submit contact form
          const response = await request(app)
            .post('/api/contact')
            .send(contactData)
            .expect(201);

          // Verify response is still successful even if email fails
          expect(response.body.success).toBe(true);
          expect(response.body.message).toBe('Contact form submitted successfully');
          expect(response.body.id).toBeDefined();

          // Verify data was still stored in database
          const storedContact = await Contact.findById(response.body.id);
          expect(storedContact).toBeTruthy();
          expect(storedContact.name).toBe(contactData.name);
          expect(storedContact.email).toBe(contactData.email.toLowerCase());
          expect(storedContact.message).toBe(contactData.message);
        }
      ), { numRuns: 50 });
    });

    test('Email service receives properly formatted contact data', () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          name: validNameGenerator,
          email: fc.emailAddress(),
          message: validMessageGenerator
        }),
        async (contactData) => {
          // Clear previous mock calls
          emailService.sendContactNotification.mockClear();

          // Submit contact form
          await request(app)
            .post('/api/contact')
            .send(contactData)
            .expect(201);

          // Wait for async email sending
          await new Promise(resolve => setTimeout(resolve, 100));

          // Verify email service was called
          expect(emailService.sendContactNotification).toHaveBeenCalledTimes(1);
          
          // Verify the structure of data passed to email service
          const emailCallArgs = emailService.sendContactNotification.mock.calls[0][0];
          expect(emailCallArgs).toHaveProperty('name');
          expect(emailCallArgs).toHaveProperty('email');
          expect(emailCallArgs).toHaveProperty('message');
          
          // Verify data types
          expect(typeof emailCallArgs.name).toBe('string');
          expect(typeof emailCallArgs.email).toBe('string');
          expect(typeof emailCallArgs.message).toBe('string');
          
          // Verify data is not empty
          expect(emailCallArgs.name.length).toBeGreaterThan(0);
          expect(emailCallArgs.email.length).toBeGreaterThan(0);
          expect(emailCallArgs.message.length).toBeGreaterThan(0);
        }
      ), { numRuns: 30 });
    });
  });
  
  describe('Property 22: Contact Data Persistence', () => {
    test('Feature: lewis-portfolio-website, Property 22: Contact Data Persistence - For any contact form submission, the data should be stored in the database with accurate timestamps', () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          name: validNameGenerator,
          email: fc.emailAddress(),
          message: validMessageGenerator
        }),
        async (contactData) => {
          const beforeSubmission = new Date();
          
          // Submit contact form
          const response = await request(app)
            .post('/api/contact')
            .send(contactData)
            .expect(201);

          const afterSubmission = new Date();

          // Verify response contains ID
          expect(response.body.success).toBe(true);
          expect(response.body.id).toBeDefined();
          expect(typeof response.body.id).toBe('string');

          // Verify data persistence in database
          const storedContact = await Contact.findById(response.body.id);
          expect(storedContact).toBeTruthy();

          // Verify all data fields are persisted correctly
          expect(storedContact.name).toBe(contactData.name);
          expect(storedContact.email).toBe(contactData.email.toLowerCase());
          expect(storedContact.message).toBe(contactData.message);
          expect(storedContact.read).toBe(false); // Default value
          
          // Verify timestamps are accurate
          expect(storedContact.createdAt).toBeInstanceOf(Date);
          expect(storedContact.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSubmission.getTime());
          expect(storedContact.createdAt.getTime()).toBeLessThanOrEqual(afterSubmission.getTime());
          
          // Verify updatedAt timestamp (from timestamps: true in schema)
          expect(storedContact.updatedAt).toBeInstanceOf(Date);
          expect(storedContact.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeSubmission.getTime());
          expect(storedContact.updatedAt.getTime()).toBeLessThanOrEqual(afterSubmission.getTime());
          
          // Verify IP address is captured
          expect(storedContact.ipAddress).toBeDefined();
          expect(typeof storedContact.ipAddress).toBe('string');
        }
      ), { numRuns: 8 }); // Reduced to 8 runs to stay within rate limit of 10 per hour
    });

    test('Contact data persists across database queries', () => {
      fc.assert(fc.asyncProperty(
        fc.array(
          fc.record({
            name: validNameGenerator,
            email: fc.emailAddress(),
            message: validMessageGenerator
          }),
          { minLength: 1, maxLength: 2 } // Reduced from 5 to 2 to stay within rate limits
        ),
        async (contactDataArray) => {
          const submittedIds = [];

          // Submit multiple contact forms
          for (const contactData of contactDataArray) {
            const response = await request(app)
              .post('/api/contact')
              .send(contactData)
              .expect(201);
            
            submittedIds.push(response.body.id);
          }

          // Verify all contacts are persisted
          const storedContacts = await Contact.find({ _id: { $in: submittedIds } });
          expect(storedContacts).toHaveLength(contactDataArray.length);

          // Verify each contact data matches what was submitted
          for (let i = 0; i < contactDataArray.length; i++) {
            const originalData = contactDataArray[i];
            const storedContact = storedContacts.find(c => c._id.toString() === submittedIds[i]);
            
            expect(storedContact).toBeTruthy();
            expect(storedContact.name).toBe(originalData.name);
            expect(storedContact.email).toBe(originalData.email.toLowerCase());
            expect(storedContact.message).toBe(originalData.message);
            expect(storedContact.read).toBe(false);
            expect(storedContact.createdAt).toBeInstanceOf(Date);
          }
        }
      ), { numRuns: 3 }); // Reduced to 3 runs to stay within rate limits
    });

    test('Contact data maintains integrity after database operations', () => {
      fc.assert(fc.asyncProperty(
        fc.record({
          name: validNameGenerator,
          email: fc.emailAddress(),
          message: validMessageGenerator
        }),
        async (contactData) => {
          // Submit contact form
          const response = await request(app)
            .post('/api/contact')
            .send(contactData)
            .expect(201);

          const contactId = response.body.id;

          // Retrieve contact multiple times to verify consistency
          const retrieval1 = await Contact.findById(contactId);
          const retrieval2 = await Contact.findById(contactId);
          const retrieval3 = await Contact.findOne({ _id: contactId });

          // Verify all retrievals return the same data
          expect(retrieval1).toBeTruthy();
          expect(retrieval2).toBeTruthy();
          expect(retrieval3).toBeTruthy();

          // Verify data consistency across retrievals
          expect(retrieval1.name).toBe(retrieval2.name);
          expect(retrieval1.name).toBe(retrieval3.name);
          expect(retrieval1.email).toBe(retrieval2.email);
          expect(retrieval1.email).toBe(retrieval3.email);
          expect(retrieval1.message).toBe(retrieval2.message);
          expect(retrieval1.message).toBe(retrieval3.message);
          expect(retrieval1.createdAt.getTime()).toBe(retrieval2.createdAt.getTime());
          expect(retrieval1.createdAt.getTime()).toBe(retrieval3.createdAt.getTime());

          // Verify original data integrity
          expect(retrieval1.name).toBe(contactData.name);
          expect(retrieval1.email).toBe(contactData.email.toLowerCase());
          expect(retrieval1.message).toBe(contactData.message);
        }
      ), { numRuns: 2 }); // Reduced to 2 runs to stay within rate limits
    });
  });
});