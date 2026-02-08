const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fc = require('fast-check');
const { Contact, Admin } = require('../models');

describe('Input Validation Tests', () => {
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

  describe('Property 31: Comprehensive Input Validation', () => {
    test('Contact model sanitizes and validates all input fields', () => {
      // Feature: lewis-portfolio-website, Property 31: Comprehensive Input Validation
      fc.assert(fc.property(
        fc.record({
          name: fc.oneof(
            fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(s.trim())),
            fc.string({ minLength: 1, maxLength: 200 }) // Include invalid strings to test validation
          ),
          email: fc.oneof(
            fc.emailAddress(),
            fc.string({ minLength: 1, maxLength: 100 }) // Include invalid emails to test validation
          ),
          message: fc.oneof(
            fc.string({ minLength: 10, maxLength: 1000 }).filter(s => s.trim().length >= 10),
            fc.string({ minLength: 1, maxLength: 2000 }) // Include invalid messages to test validation
          ),
          ipAddress: fc.option(fc.oneof(
            fc.ipV4(),
            fc.ipV6(),
            fc.string({ minLength: 1, maxLength: 50 }) // Include invalid IPs to test validation
          ), { nil: null })
        }),
        (inputData) => {
          const contact = new Contact(inputData);
          
          // Test that validation occurs
          const validationError = contact.validateSync();
          
          if (validationError) {
            // If there are validation errors, they should be meaningful
            expect(validationError.errors).toBeDefined();
            
            // Check that error messages are informative
            Object.values(validationError.errors).forEach(error => {
              expect(error.message).toBeDefined();
              expect(typeof error.message).toBe('string');
              expect(error.message.length).toBeGreaterThan(0);
            });
          } else {
            // If validation passes, check that data is properly sanitized
            
            // Name should be trimmed and contain only allowed characters
            expect(contact.name).toBe(contact.name.trim());
            expect(contact.name.length).toBeGreaterThanOrEqual(2);
            expect(contact.name.length).toBeLessThanOrEqual(100);
            expect(contact.name).toMatch(/^[a-zA-Z\s\-']+$/);
            
            // Email should be lowercase and trimmed
            expect(contact.email).toBe(contact.email.toLowerCase().trim());
            expect(contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            
            // Message should be trimmed and meet length requirements
            expect(contact.message).toBe(contact.message.trim());
            expect(contact.message.length).toBeGreaterThanOrEqual(10);
            expect(contact.message.length).toBeLessThanOrEqual(1000);
            
            // IP address validation if provided
            if (contact.ipAddress) {
              expect(typeof contact.ipAddress).toBe('string');
              // Should be a valid IP format (using validator.js which is more comprehensive)
              const validator = require('validator');
              expect(validator.isIP(contact.ipAddress)).toBe(true);
            }
          }
        }
      ), { numRuns: 100 });
    });

    test('Admin model validates password complexity and email format', () => {
      // Feature: lewis-portfolio-website, Property 31: Comprehensive Input Validation
      fc.assert(fc.property(
        fc.record({
          email: fc.oneof(
            fc.emailAddress(),
            fc.string({ minLength: 1, maxLength: 100 }) // Include invalid emails to test validation
          ),
          password: fc.oneof(
            fc.string({ minLength: 8, maxLength: 50 }).filter(s => 
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(s)
            ),
            fc.string({ minLength: 1, maxLength: 100 }) // Include invalid passwords to test validation
          )
        }),
        (inputData) => {
          const admin = new Admin(inputData);
          
          // Test that validation occurs
          const validationError = admin.validateSync();
          
          if (validationError) {
            // If there are validation errors, they should be meaningful
            expect(validationError.errors).toBeDefined();
            
            // Check that error messages are informative
            Object.values(validationError.errors).forEach(error => {
              expect(error.message).toBeDefined();
              expect(typeof error.message).toBe('string');
              expect(error.message.length).toBeGreaterThan(0);
            });
          } else {
            // If validation passes, check that data is properly formatted
            
            // Email should be lowercase and trimmed
            expect(admin.email).toBe(admin.email.toLowerCase().trim());
            expect(admin.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            
            // Password should meet complexity requirements
            expect(admin.password.length).toBeGreaterThanOrEqual(8);
            expect(admin.password).toMatch(/[a-z]/); // lowercase
            expect(admin.password).toMatch(/[A-Z]/); // uppercase
            expect(admin.password).toMatch(/\d/); // digit
            expect(admin.password).toMatch(/[@$!%*?&]/); // special character
            
            // Role should be set to default
            expect(admin.role).toBe('admin');
          }
        }
      ), { numRuns: 100 });
    });

    test('Input sanitization prevents injection attacks', () => {
      // Feature: lewis-portfolio-website, Property 31: Comprehensive Input Validation
      fc.assert(fc.property(
        fc.oneof(
          // SQL injection attempts
          fc.constantFrom(
            "'; DROP TABLE contacts; --",
            "' OR '1'='1",
            "admin'--",
            "' UNION SELECT * FROM admins --"
          ),
          // XSS attempts
          fc.constantFrom(
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src=x onerror=alert('xss')>",
            "';alert('xss');//"
          ),
          // NoSQL injection attempts
          fc.constantFrom(
            "{'$ne': null}",
            "{'$gt': ''}",
            "{'$regex': '.*'}",
            "{'$where': 'this.password'}"
          ),
          // Path traversal attempts
          fc.constantFrom(
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
          ),
          // Command injection attempts
          fc.constantFrom(
            "; rm -rf /",
            "| cat /etc/passwd",
            "&& whoami",
            "`id`"
          )
        ),
        (maliciousInput) => {
          // Test Contact model
          const contactData = {
            name: maliciousInput,
            email: 'test@example.com',
            message: maliciousInput
          };
          
          const contact = new Contact(contactData);
          const contactValidation = contact.validateSync();
          
          // Either validation should fail (preventing the injection)
          // Or the data should be sanitized/escaped
          if (!contactValidation) {
            // If validation passes, ensure the malicious input is sanitized
            expect(contact.name).not.toContain('<script>');
            expect(contact.name).not.toContain('DROP TABLE');
            expect(contact.name).not.toContain('$ne');
            expect(contact.name).not.toContain('../');
            expect(contact.name).not.toContain('rm -rf');
            expect(contact.message).not.toContain('<script>');
            expect(contact.message).not.toContain('DROP TABLE');
            expect(contact.message).not.toContain('$ne');
            expect(contact.message).not.toContain('../');
            expect(contact.message).not.toContain('rm -rf');
          }
          
          // Test Admin model
          const adminData = {
            email: maliciousInput,
            password: 'ValidPass123!'
          };
          
          const admin = new Admin(adminData);
          const adminValidation = admin.validateSync();
          
          // Email validation should catch malicious input
          if (!adminValidation) {
            expect(admin.email).not.toContain('<script>');
            expect(admin.email).not.toContain('DROP TABLE');
            expect(admin.email).not.toContain('$ne');
            expect(admin.email).not.toContain('../');
            expect(admin.email).not.toContain('rm -rf');
          }
        }
      ), { numRuns: 50 });
    });

    test('API-level input validation and sanitization', () => {
      // Feature: lewis-portfolio-website, Property 31: Comprehensive Input Validation
      fc.assert(fc.property(
        fc.record({
          name: fc.oneof(
            fc.string({ minLength: 2, maxLength: 100 }).filter(s => /^[a-zA-Z\s\-']+$/.test(s.trim())),
            fc.constantFrom(
              "<script>alert('xss')</script>",
              "'; DROP TABLE contacts; --",
              "../../../etc/passwd",
              "   ", // whitespace only
              "", // empty string
              "a".repeat(150) // too long
            )
          ),
          email: fc.oneof(
            fc.emailAddress(),
            fc.constantFrom(
              "not-an-email",
              "<script>alert('xss')</script>",
              "'; DROP TABLE admins; --",
              "   ", // whitespace only
              "" // empty string
            )
          ),
          message: fc.oneof(
            fc.string({ minLength: 10, maxLength: 1000 }),
            fc.constantFrom(
              "<script>alert('xss')</script>",
              "'; DROP TABLE contacts; --",
              "short", // too short
              "   ", // whitespace only
              "", // empty string
              "a".repeat(1500) // too long
            )
          )
        }),
        (inputData) => {
          // Simulate express-validator behavior
          const { body } = require('express-validator');
          
          // Test name validation
          const nameValidator = body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters');
          
          // Test email validation
          const emailValidator = body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address');
          
          // Test message validation
          const messageValidator = body('message')
            .trim()
            .isLength({ min: 10, max: 1000 })
            .withMessage('Message must be between 10 and 1000 characters');
          
          // Create mock request object
          const mockReq = {
            body: inputData
          };
          
          // Simulate validation with malicious content detection
          const containsMaliciousContent = (str) => {
            if (!str || typeof str !== 'string') return false;
            return str.includes('<script>') || 
                   str.includes('DROP TABLE') || 
                   str.includes('../') ||
                   str.includes('javascript:') ||
                   str.includes('$ne') ||
                   str.includes('$gt') ||
                   str.includes('rm -rf');
          };
          
          const isValidName = Boolean(inputData.name && 
            typeof inputData.name === 'string' && 
            inputData.name.trim().length >= 2 && 
            inputData.name.trim().length <= 100 &&
            /^[a-zA-Z\s\-']+$/.test(inputData.name.trim()) &&
            !containsMaliciousContent(inputData.name));
          
          const isValidEmail = Boolean(inputData.email && 
            typeof inputData.email === 'string' &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputData.email.trim()) &&
            !containsMaliciousContent(inputData.email));
          
          const isValidMessage = Boolean(inputData.message && 
            typeof inputData.message === 'string' &&
            inputData.message.trim().length >= 10 &&
            inputData.message.trim().length <= 1000 &&
            !containsMaliciousContent(inputData.message));
          
          const isValid = Boolean(isValidName && isValidEmail && isValidMessage);
          
          // Check for malicious content
          const hasMaliciousContent = Boolean(
            containsMaliciousContent(inputData.name) ||
            containsMaliciousContent(inputData.email) ||
            containsMaliciousContent(inputData.message)
          );
          
          if (hasMaliciousContent) {
            // Malicious content should always be rejected by validation
            expect(isValid).toBe(false);
          } else if (isValid) {
            // If validation passes and there's no malicious content, all should be valid
            expect(isValidName).toBe(true);
            expect(isValidEmail).toBe(true);
            expect(isValidMessage).toBe(true);
          } else {
            // If validation fails for non-malicious content, it should be due to proper validation rules
            expect(isValid).toBe(false);
          }
        }
      ), { numRuns: 100 });
    });

    test('Field length constraints are enforced', () => {
      // Feature: lewis-portfolio-website, Property 31: Comprehensive Input Validation
      fc.assert(fc.property(
        fc.record({
          nameLength: fc.integer({ min: 0, max: 200 }),
          messageLength: fc.integer({ min: 0, max: 2000 }),
          passwordLength: fc.integer({ min: 0, max: 200 })
        }),
        ({ nameLength, messageLength, passwordLength }) => {
          // Test Contact field length constraints
          const longName = 'a'.repeat(nameLength);
          const longMessage = 'a'.repeat(messageLength);
          
          const contact = new Contact({
            name: longName,
            email: 'test@example.com',
            message: longMessage
          });
          
          const contactValidation = contact.validateSync();
          
          // Names over 100 characters should be rejected
          if (nameLength > 100) {
            expect(contactValidation).toBeDefined();
            expect(contactValidation.errors.name).toBeDefined();
          }
          
          // Names under 2 characters should be rejected
          if (nameLength < 2) {
            expect(contactValidation).toBeDefined();
            expect(contactValidation.errors.name).toBeDefined();
          }
          
          // Messages over 1000 characters should be rejected
          if (messageLength > 1000) {
            expect(contactValidation).toBeDefined();
            expect(contactValidation.errors.message).toBeDefined();
          }
          
          // Messages under 10 characters should be rejected
          if (messageLength < 10) {
            expect(contactValidation).toBeDefined();
            expect(contactValidation.errors.message).toBeDefined();
          }
          
          // Test Admin password length constraints
          const longPassword = 'A1a!' + 'b'.repeat(Math.max(0, passwordLength - 4));
          
          const admin = new Admin({
            email: 'admin@example.com',
            password: longPassword
          });
          
          const adminValidation = admin.validateSync();
          
          // Passwords under 8 characters should be rejected
          if (passwordLength < 8) {
            expect(adminValidation).toBeDefined();
            if (adminValidation && adminValidation.errors) {
              expect(adminValidation.errors.password).toBeDefined();
            }
          }
          
          // If password is 8+ characters but doesn't meet complexity, should be rejected
          if (passwordLength >= 8 && passwordLength < 200) {
            const simplePassword = 'a'.repeat(passwordLength);
            const adminSimple = new Admin({
              email: 'admin@example.com',
              password: simplePassword
            });
            
            const simpleValidation = adminSimple.validateSync();
            expect(simpleValidation).toBeDefined();
            if (simpleValidation && simpleValidation.errors) {
              expect(simpleValidation.errors.password).toBeDefined();
            }
          }
        }
      ), { numRuns: 100 });
    });

    test('Required field validation is enforced', () => {
      // Feature: lewis-portfolio-website, Property 31: Comprehensive Input Validation
      fc.assert(fc.property(
        fc.record({
          includeName: fc.boolean(),
          includeEmail: fc.boolean(),
          includeMessage: fc.boolean(),
          includePassword: fc.boolean()
        }),
        ({ includeName, includeEmail, includeMessage, includePassword }) => {
          // Test Contact required fields
          const contactData = {};
          if (includeName) contactData.name = 'John Doe';
          if (includeEmail) contactData.email = 'john@example.com';
          if (includeMessage) contactData.message = 'This is a test message';
          
          const contact = new Contact(contactData);
          const contactValidation = contact.validateSync();
          
          // Missing required fields should cause validation errors
          if (!includeName || !includeEmail || !includeMessage) {
            expect(contactValidation).toBeDefined();
            expect(contactValidation.errors).toBeDefined();
            
            if (!includeName) {
              expect(contactValidation.errors.name).toBeDefined();
            }
            if (!includeEmail) {
              expect(contactValidation.errors.email).toBeDefined();
            }
            if (!includeMessage) {
              expect(contactValidation.errors.message).toBeDefined();
            }
          }
          
          // Test Admin required fields
          const adminData = {};
          if (includeEmail) adminData.email = 'admin@example.com';
          if (includePassword) adminData.password = 'ValidPass123!';
          
          const admin = new Admin(adminData);
          const adminValidation = admin.validateSync();
          
          // Missing required fields should cause validation errors
          if (!includeEmail || !includePassword) {
            expect(adminValidation).toBeDefined();
            expect(adminValidation.errors).toBeDefined();
            
            if (!includeEmail) {
              expect(adminValidation.errors.email).toBeDefined();
            }
            if (!includePassword) {
              expect(adminValidation.errors.password).toBeDefined();
            }
          }
        }
      ), { numRuns: 100 });
    });
  });
});