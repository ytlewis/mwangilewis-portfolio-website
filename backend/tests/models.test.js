const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fc = require('fast-check');
const { Contact, Admin } = require('../models');

describe('Database Schema Compliance Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
    await Admin.deleteMany({});
  });

  describe('Property 39: Database Schema Compliance', () => {
    // Custom generators for valid data
    const validNameGenerator = fc.string({ minLength: 2, maxLength: 100 })
      .map(s => s.replace(/[^a-zA-Z\s\-']/g, 'A'))
      .filter(s => s.trim().length >= 2)
      .map(s => s.trim());

    const validMessageGenerator = fc.string({ minLength: 10, maxLength: 1000 })
      .map(s => {
        const trimmed = s.trim();
        return trimmed.length >= 10 ? trimmed : 'This is a valid test message that meets the minimum length requirement.';
      });

    const validPasswordGenerator = fc.tuple(
      fc.char().filter(c => /[a-z]/.test(c)),
      fc.char().filter(c => /[A-Z]/.test(c)),
      fc.char().filter(c => /\d/.test(c)),
      fc.char().filter(c => /[@$!%*?&]/.test(c)),
      fc.string({ minLength: 4, maxLength: 46 }).map(s => s.replace(/[^A-Za-z0-9@$!%*?&]/g, 'a'))
    ).map(([lower, upper, digit, special, rest]) => lower + upper + digit + special + rest);

    test('Contact schema validates required fields and constraints', () => {
      // Feature: lewis-portfolio-website, Property 39: Database Schema Compliance
      fc.assert(fc.property(
        fc.record({
          name: validNameGenerator,
          email: fc.emailAddress(),
          message: validMessageGenerator,
          ipAddress: fc.option(fc.ipV4(), { nil: null })
        }),
        (contactData) => {
          const contact = new Contact(contactData);
          
          // Validate that the document passes schema validation
          const validationError = contact.validateSync();
          
          // Since we're using valid generators, validation should pass
          if (validationError) {
            console.log('Validation failed for:', contactData);
            console.log('Errors:', validationError.errors);
            return false;
          }
          
          // Validate field types match schema definition
          if (typeof contact.name !== 'string') return false;
          if (typeof contact.email !== 'string') return false;
          if (typeof contact.message !== 'string') return false;
          if (contact.read !== false) return false; // Default value
          if (!(contact.createdAt instanceof Date)) return false;
          
          // Validate field constraints
          if (contact.name.length < 2 || contact.name.length > 100) return false;
          if (contact.message.length < 10 || contact.message.length > 1000) return false;
          
          // Validate email format
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return false;
          
          // Validate IP address format if provided
          if (contact.ipAddress && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(contact.ipAddress)) {
            return false;
          }
          
          return true;
        }
      ), { numRuns: 100 });
    });

    test('Admin schema validates required fields and constraints', () => {
      // Feature: lewis-portfolio-website, Property 39: Database Schema Compliance
      fc.assert(fc.property(
        fc.record({
          email: fc.emailAddress(),
          password: validPasswordGenerator
        }),
        (adminData) => {
          const admin = new Admin(adminData);
          
          // Validate that the document passes schema validation
          const validationError = admin.validateSync();
          
          // Since we're using valid generators, validation should pass
          if (validationError) {
            console.log('Admin validation failed for:', adminData);
            console.log('Errors:', validationError.errors);
            return false;
          }
          
          // Validate field types match schema definition
          if (typeof admin.email !== 'string') return false;
          if (typeof admin.password !== 'string') return false;
          if (admin.role !== 'admin') return false; // Default value
          if (admin.isActive !== true) return false; // Default value
          if (admin.loginAttempts !== 0) return false; // Default value
          if (!(admin.createdAt instanceof Date)) return false;
          
          // Validate field constraints
          if (admin.password.length < 8) return false;
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) return false;
          
          // Validate password complexity
          if (!/[a-z]/.test(admin.password)) return false; // lowercase
          if (!/[A-Z]/.test(admin.password)) return false; // uppercase
          if (!/\d/.test(admin.password)) return false; // digit
          if (!/[@$!%*?&]/.test(admin.password)) return false; // special character
          
          return true;
        }
      ), { numRuns: 100 });
    });

    test('Contact schema rejects invalid data', () => {
      // Feature: lewis-portfolio-website, Property 39: Database Schema Compliance
      fc.assert(fc.property(
        fc.oneof(
          // Invalid name (too short)
          fc.record({
            name: fc.constantFrom('', 'a'),
            email: fc.emailAddress(),
            message: validMessageGenerator
          }),
          // Invalid name (contains invalid characters)
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
        (invalidContactData) => {
          const contact = new Contact(invalidContactData);
          const validationError = contact.validateSync();
          
          // Should have validation errors for invalid data
          expect(validationError).toBeDefined();
          expect(validationError.errors).toBeDefined();
          expect(Object.keys(validationError.errors).length).toBeGreaterThan(0);
        }
      ), { numRuns: 50 });
    });

    test('Admin schema rejects invalid data', () => {
      // Feature: lewis-portfolio-website, Property 39: Database Schema Compliance
      fc.assert(fc.property(
        fc.oneof(
          // Invalid email
          fc.record({
            email: fc.constantFrom('invalid', 'no@', '@domain.com', 'test@'),
            password: validPasswordGenerator
          }),
          // Invalid password (too short)
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ maxLength: 7 })
          }),
          // Invalid password (missing lowercase)
          fc.record({
            email: fc.emailAddress(),
            password: fc.constantFrom('PASSWORD123!', 'UPPER123@', 'NOLOWER1!')
          }),
          // Invalid password (missing uppercase)
          fc.record({
            email: fc.emailAddress(),
            password: fc.constantFrom('password123!', 'lower123@', 'noupper1!')
          }),
          // Invalid password (missing digit)
          fc.record({
            email: fc.emailAddress(),
            password: fc.constantFrom('Password!', 'NoDigits@', 'Letters!')
          }),
          // Invalid password (missing special character)
          fc.record({
            email: fc.emailAddress(),
            password: fc.constantFrom('Password123', 'NoSpecial1', 'Letters1')
          })
        ),
        (invalidAdminData) => {
          const admin = new Admin(invalidAdminData);
          const validationError = admin.validateSync();
          
          // Should have validation errors for invalid data
          expect(validationError).toBeDefined();
          expect(validationError.errors).toBeDefined();
          expect(Object.keys(validationError.errors).length).toBeGreaterThan(0);
        }
      ), { numRuns: 50 });
    });
  });
});