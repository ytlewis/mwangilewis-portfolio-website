const fc = require('fast-check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Authentication System Properties', () => {
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
    await Admin.deleteMany({});
  });

  describe('Property 13: Password Security Implementation', () => {
    test('Feature: lewis-portfolio-website, Property 13: Password Security Implementation', async () => {
      // Property: For any password storage operation, the password should be hashed using bcrypt before database storage
      // Validates: Requirements 4.6

      await fc.assert(fc.asyncProperty(
        fc.string({ minLength: 8, maxLength: 50 }).filter(s => 
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(s)
        ),
        fc.emailAddress(),
        async (password, email) => {
          // Create admin with password
          const admin = new Admin({
            email: email,
            password: password
          });

          await admin.save();

          // Verify password is hashed (not stored in plain text)
          expect(admin.password).not.toBe(password);
          
          // Verify it's a bcrypt hash (starts with $2b$ and has proper length)
          expect(admin.password).toMatch(/^\$2b\$\d{2}\$/);
          expect(admin.password.length).toBeGreaterThan(50);
          
          // Verify the hash can be verified with bcrypt
          const isValid = await bcrypt.compare(password, admin.password);
          expect(isValid).toBe(true);
          
          // Verify wrong password fails
          const isInvalid = await bcrypt.compare(password + 'wrong', admin.password);
          expect(isInvalid).toBe(false);
        }
      ), { numRuns: 20 });
    });

    test('Password hashing uses bcrypt with proper salt rounds', async () => {
      const password = 'TestPass123!';
      const email = 'test@example.com';
      
      const admin = new Admin({ email, password });
      await admin.save();
      
      // Verify bcrypt format and salt rounds (should be 12)
      const hashParts = admin.password.split('$');
      expect(hashParts[1]).toBe('2b'); // bcrypt algorithm
      expect(hashParts[2]).toBe('12'); // salt rounds
    });

    test('comparePassword method works correctly', async () => {
      const password = 'TestPass123!';
      const email = 'test@example.com';
      
      const admin = new Admin({ email, password });
      await admin.save();
      
      // Test correct password
      const isValid = await admin.comparePassword(password);
      expect(isValid).toBe(true);
      
      // Test incorrect password
      const isInvalid = await admin.comparePassword('WrongPass123!');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Property 14: JWT Token Management', () => {
    test('Feature: lewis-portfolio-website, Property 14: JWT Token Management', async () => {
      // Property: For any successful authentication, the system should generate and manage JWT tokens for secure session handling
      // Validates: Requirements 4.5

      await fc.assert(fc.asyncProperty(
        fc.string({ minLength: 8, maxLength: 50 }).filter(s => 
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(s)
        ),
        fc.emailAddress(),
        async (password, email) => {
          // Create admin
          const admin = new Admin({
            email: email,
            password: password
          });
          await admin.save();

          // Generate JWT token
          const token = generateToken(admin._id);

          // Verify token is a valid JWT format (3 parts separated by dots)
          const tokenParts = token.split('.');
          expect(tokenParts).toHaveLength(3);

          // Verify token can be decoded and contains correct data
          const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
          const decoded = jwt.verify(token, JWT_SECRET);
          
          expect(decoded.adminId).toBe(admin._id.toString());
          expect(decoded.type).toBe('admin');
          expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
          expect(decoded.iat).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));

          // Verify token expires in the future
          const expirationTime = decoded.exp * 1000; // Convert to milliseconds
          expect(expirationTime).toBeGreaterThan(Date.now());
        }
      ), { numRuns: 20 });
    });

    test('JWT tokens have proper structure and claims', async () => {
      const admin = new Admin({
        email: 'test@example.com',
        password: 'TestPass123!'
      });
      await admin.save();

      const token = generateToken(admin._id);
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET);

      // Verify required claims
      expect(decoded).toHaveProperty('adminId');
      expect(decoded).toHaveProperty('type');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
      
      // Verify claim values
      expect(decoded.adminId).toBe(admin._id.toString());
      expect(decoded.type).toBe('admin');
    });

    test('JWT tokens expire correctly', async () => {
      const admin = new Admin({
        email: 'test@example.com',
        password: 'TestPass123!'
      });
      await admin.save();

      // Create a token with short expiration for testing
      const shortToken = jwt.sign(
        { adminId: admin._id, type: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1ms' }
      );

      // Wait a bit to ensure expiration
      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify token is expired
      expect(() => {
        jwt.verify(shortToken, process.env.JWT_SECRET || 'your-secret-key');
      }).toThrow('jwt expired');
    });

    test('Invalid JWT tokens are rejected', async () => {
      const invalidTokens = [
        'invalid.token.format',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        '',
        'not-a-jwt-at-all'
      ];

      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

      invalidTokens.forEach(token => {
        expect(() => {
          jwt.verify(token, JWT_SECRET);
        }).toThrow();
      });
    });
  });
});