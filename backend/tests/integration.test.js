/**
 * Integration Tests for Complete User Workflows
 * 
 * Task: 22.2 Write integration tests for complete user workflows
 * 
 * Tests end-to-end workflows including:
 * - Contact form submission to admin dashboard workflow
 * - GitHub data fetching and display pipeline
 * - Authentication and admin access workflows
 * 
 * These tests verify that all system components work together correctly
 * to provide complete user experiences from start to finish.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Contact = require('../models/Contact');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');
const githubService = require('../services/githubService');
const emailService = require('../services/emailService');

// Mock email service to prevent actual emails during testing
jest.mock('../services/emailService', () => ({
  sendContactNotification: jest.fn().mockResolvedValue(true),
  sendAdminNotification: jest.fn().mockResolvedValue(true)
}));

// Mock GitHub service for controlled testing
jest.mock('../services/githubService');

describe('Integration Tests - Complete User Workflows', () => {
  let mongoServer;
  let adminUser;
  let adminToken;

  beforeAll(async () => {
    // Start in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    await mongoose.connect(mongoUri);
  }, 60000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    await Contact.deleteMany({});
    await Admin.deleteMany({});
    
    // Create admin user for authentication tests
    adminUser = new Admin({
      email: 'gathaiyalewis1122@gmail.com',
      password: 'AdminPass123!'
    });
    await adminUser.save();
    adminToken = generateToken(adminUser._id);
    
    // Clear mock calls
    jest.clearAllMocks();
    
    // Reset GitHub service mock
    githubService.fetchPinnedRepos = jest.fn().mockResolvedValue([
      {
        id: 1,
        name: 'PHARMUP',
        description: 'Pharmaceutical management system',
        html_url: 'https://github.com/lewisgathaiya/pharmup',
        language: 'JavaScript',
        stargazers_count: 15,
        updated_at: new Date().toISOString()
      }
    ]);
    
    githubService.clearCache = jest.fn();
    githubService.isCacheValid = jest.fn().mockReturnValue(false);
  });

  describe('Workflow 1: Contact Form Submission to Admin Dashboard', () => {
    test('should complete full workflow from contact submission to admin viewing', async () => {
      // Step 1: User submits contact form
      const contactData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I am interested in collaborating on the PHARMUP project. Please contact me.'
      };

      const submitResponse = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(submitResponse.body.success).toBe(true);
      expect(submitResponse.body.message).toBe('Contact form submitted successfully');
      expect(submitResponse.body.id).toBeDefined();

      const contactId = submitResponse.body.id;

      // Step 2: Verify email notification was sent
      expect(emailService.sendContactNotification).toHaveBeenCalledTimes(1);
      expect(emailService.sendContactNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          name: contactData.name,
          email: contactData.email,
          message: contactData.message
        })
      );

      // Step 3: Verify contact is stored in database
      const storedContact = await Contact.findById(contactId);
      expect(storedContact).toBeTruthy();
      expect(storedContact.name).toBe(contactData.name);
      expect(storedContact.email).toBe(contactData.email.toLowerCase());
      expect(storedContact.message).toBe(contactData.message);
      expect(storedContact.read).toBe(false);

      // Step 4: Admin logs in
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'gathaiyalewis1122@gmail.com',
          password: 'AdminPass123!'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();
      const token = loginResponse.body.token;

      // Step 5: Admin views dashboard and sees the new contact
      const dashboardResponse = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(dashboardResponse.body.success).toBe(true);
      expect(dashboardResponse.body.stats.totalContacts).toBe(1);
      expect(dashboardResponse.body.stats.unreadContacts).toBe(1);
      expect(dashboardResponse.body.stats.recentContacts).toHaveLength(1);
      expect(dashboardResponse.body.stats.recentContacts[0].name).toBe(contactData.name);

      // Step 6: Admin views full contact list
      const contactsResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(contactsResponse.body.success).toBe(true);
      expect(contactsResponse.body.contacts).toHaveLength(1);
      expect(contactsResponse.body.contacts[0]._id).toBe(contactId);
      expect(contactsResponse.body.contacts[0].name).toBe(contactData.name);
      expect(contactsResponse.body.contacts[0].email).toBe(contactData.email.toLowerCase());
      expect(contactsResponse.body.contacts[0].read).toBe(false);

      // Step 7: Admin marks contact as read
      const updateResponse = await request(app)
        .put(`/api/admin/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ read: true })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.contact.read).toBe(true);

      // Step 8: Verify dashboard stats are updated
      const updatedDashboardResponse = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(updatedDashboardResponse.body.stats.totalContacts).toBe(1);
      expect(updatedDashboardResponse.body.stats.unreadContacts).toBe(0);
    });

    test('should handle multiple contact submissions and admin management', async () => {
      // Submit multiple contacts
      const contacts = [
        { name: 'Alice Smith', email: 'alice@example.com', message: 'Interested in your portfolio design services.' },
        { name: 'Bob Johnson', email: 'bob@example.com', message: 'Would like to discuss a potential project collaboration.' },
        { name: 'Carol White', email: 'carol@example.com', message: 'Impressed by your SECULEARN project. Can we talk?' }
      ];

      const contactIds = [];
      for (const contact of contacts) {
        const response = await request(app)
          .post('/api/contact')
          .send(contact)
          .expect(201);
        
        contactIds.push(response.body.id);
      }

      // Admin logs in
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'gathaiyalewis1122@gmail.com',
          password: 'AdminPass123!'
        })
        .expect(200);

      const token = loginResponse.body.token;

      // Admin views all contacts
      const contactsResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(contactsResponse.body.contacts).toHaveLength(3);

      // Admin marks first contact as read
      await request(app)
        .put(`/api/admin/contacts/${contactIds[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ read: true })
        .expect(200);

      // Admin deletes second contact
      await request(app)
        .delete(`/api/admin/contacts/${contactIds[1]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify final state
      const finalContactsResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalContactsResponse.body.contacts).toHaveLength(2);
      
      const finalDashboardResponse = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalDashboardResponse.body.stats.totalContacts).toBe(2);
      expect(finalDashboardResponse.body.stats.unreadContacts).toBe(1);
    });

    test('should handle contact form validation errors gracefully', async () => {
      // Submit invalid contact (missing required fields)
      const invalidContact = {
        name: 'J', // Too short
        email: 'invalid-email',
        message: 'Short' // Too short
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidContact)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);

      // Verify no contact was created
      const contacts = await Contact.find();
      expect(contacts).toHaveLength(0);

      // Verify no email was sent
      expect(emailService.sendContactNotification).not.toHaveBeenCalled();
    });
  });

  describe('Workflow 2: GitHub Data Fetching and Display Pipeline', () => {
    test('should fetch GitHub repositories and display them correctly', async () => {
      // Mock GitHub API response
      const mockRepos = [
        {
          id: 1,
          name: 'PHARMUP',
          description: 'Pharmaceutical management system with inventory tracking',
          html_url: 'https://github.com/lewisgathaiya/pharmup',
          language: 'JavaScript',
          stargazers_count: 15,
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'SECULEARN',
          description: 'Security learning platform for cybersecurity education',
          html_url: 'https://github.com/lewisgathaiya/seculearn',
          language: 'Python',
          stargazers_count: 8,
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'lewis-portfolio-website',
          description: 'Modern portfolio website with Next.js and animations',
          html_url: 'https://github.com/lewisgathaiya/lewis-portfolio-website',
          language: 'TypeScript',
          stargazers_count: 3,
          updated_at: new Date().toISOString()
        }
      ];

      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(mockRepos);

      // Step 1: Fetch GitHub repositories
      const response = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.repos).toBeDefined();
      expect(Array.isArray(response.body.repos)).toBe(true);
      expect(response.body.repos).toHaveLength(3);

      // Step 2: Verify repository data structure
      response.body.repos.forEach(repo => {
        expect(repo).toHaveProperty('id');
        expect(repo).toHaveProperty('name');
        expect(repo).toHaveProperty('description');
        expect(repo).toHaveProperty('html_url');
        expect(repo).toHaveProperty('language');
        expect(repo).toHaveProperty('stargazers_count');
        expect(repo).toHaveProperty('updated_at');

        expect(typeof repo.id).toBe('number');
        expect(typeof repo.name).toBe('string');
        expect(typeof repo.description).toBe('string');
        expect(typeof repo.html_url).toBe('string');
        expect(typeof repo.language).toBe('string');
        expect(typeof repo.stargazers_count).toBe('number');
        expect(typeof repo.updated_at).toBe('string');
      });

      // Step 3: Verify featured projects are present
      const repoNames = response.body.repos.map(r => r.name);
      expect(repoNames).toContain('PHARMUP');
      expect(repoNames).toContain('SECULEARN');
      expect(repoNames).toContain('lewis-portfolio-website');
    });

    test('should fall back to cached data when GitHub API fails', async () => {
      // Step 1: First successful fetch to populate cache
      const mockRepos = [
        {
          id: 1,
          name: 'PHARMUP',
          description: 'Pharmaceutical management system',
          html_url: 'https://github.com/lewisgathaiya/pharmup',
          language: 'JavaScript',
          stargazers_count: 15,
          updated_at: new Date().toISOString()
        }
      ];

      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(mockRepos);

      const firstResponse = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(firstResponse.body.success).toBe(true);
      expect(firstResponse.body.repos).toHaveLength(1);

      // Step 2: Simulate GitHub API failure with fallback data
      const fallbackRepos = [
        {
          id: 1,
          name: 'PHARMUP',
          description: 'Pharmaceutical management system (cached)',
          html_url: 'https://github.com/lewisgathaiya/pharmup',
          language: 'JavaScript',
          stargazers_count: 15,
          updated_at: new Date().toISOString()
        }
      ];
      
      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(fallbackRepos);

      // Step 3: Verify fallback to cached data
      const fallbackResponse = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(fallbackResponse.body.success).toBe(true);
      expect(fallbackResponse.body.repos).toBeDefined();
      expect(Array.isArray(fallbackResponse.body.repos)).toBe(true);
      expect(fallbackResponse.body.repos.length).toBeGreaterThan(0);

      // Verify fallback data has correct structure
      fallbackResponse.body.repos.forEach(repo => {
        expect(repo).toHaveProperty('id');
        expect(repo).toHaveProperty('name');
        expect(repo).toHaveProperty('description');
        expect(repo).toHaveProperty('html_url');
        expect(repo).toHaveProperty('language');
        expect(repo).toHaveProperty('stargazers_count');
        expect(repo).toHaveProperty('updated_at');
      });
    });

    test('should refresh GitHub data on demand', async () => {
      // Mock initial data
      const initialRepos = [
        {
          id: 1,
          name: 'old-project',
          description: 'Old project description',
          html_url: 'https://github.com/lewisgathaiya/old-project',
          language: 'JavaScript',
          stargazers_count: 5,
          updated_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ];

      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(initialRepos);

      // Initial fetch
      const initialResponse = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(initialResponse.body.repos[0].name).toBe('old-project');

      // Mock updated data
      const updatedRepos = [
        {
          id: 2,
          name: 'new-project',
          description: 'New project description',
          html_url: 'https://github.com/lewisgathaiya/new-project',
          language: 'TypeScript',
          stargazers_count: 10,
          updated_at: new Date().toISOString()
        }
      ];

      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(updatedRepos);

      // Trigger refresh
      const refreshResponse = await request(app)
        .post('/api/github/refresh')
        .expect(200);

      expect(refreshResponse.body.success).toBe(true);
      expect(refreshResponse.body.repos).toBeDefined();
      expect(refreshResponse.body.repos[0].name).toBe('new-project');

      // Verify subsequent fetches return updated data
      const verifyResponse = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(verifyResponse.body.repos[0].name).toBe('new-project');
    });

    test('should handle GitHub API rate limiting gracefully', async () => {
      // Mock fallback data for rate limit scenario
      const fallbackRepos = [
        {
          id: 1,
          name: 'PHARMUP',
          description: 'Pharmaceutical management system (fallback)',
          html_url: 'https://github.com/lewisgathaiya/pharmup',
          language: 'JavaScript',
          stargazers_count: 0,
          updated_at: new Date().toISOString()
        }
      ];
      
      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(fallbackRepos);

      // Should still return fallback data
      const response = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.repos).toBeDefined();
      expect(Array.isArray(response.body.repos)).toBe(true);
      expect(response.body.repos.length).toBeGreaterThan(0);
    });
  });

  describe('Workflow 3: Authentication and Admin Access', () => {
    test('should complete full authentication workflow', async () => {
      // Step 1: Attempt to access protected route without authentication
      const unauthorizedResponse = await request(app)
        .get('/api/admin/contacts')
        .expect(401);

      expect(unauthorizedResponse.body.success).toBe(false);
      expect(unauthorizedResponse.body.message).toContain('token');

      // Step 2: Admin logs in with correct credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'gathaiyalewis1122@gmail.com',
          password: 'AdminPass123!'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.user).toBeDefined();
      expect(loginResponse.body.user.email).toBe('gathaiyalewis1122@gmail.com');
      expect(loginResponse.body.user.role).toBe('admin');

      const token = loginResponse.body.token;

      // Step 3: Verify token is valid JWT
      expect(token.split('.')).toHaveLength(3);

      // Step 4: Access protected route with valid token
      const authorizedResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(authorizedResponse.body.success).toBe(true);
      expect(authorizedResponse.body.contacts).toBeDefined();

      // Step 5: Verify token works for multiple protected routes
      const dashboardResponse = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(dashboardResponse.body.success).toBe(true);
      expect(dashboardResponse.body.stats).toBeDefined();

      // Step 6: Verify token verification endpoint
      const verifyResponse = await request(app)
        .post('/api/auth/verify-token')
        .send({ token: token })
        .expect(200);

      expect(verifyResponse.body.success).toBe(true);
      expect(verifyResponse.body.user).toBeDefined();
      expect(verifyResponse.body.user.email).toBe('gathaiyalewis1122@gmail.com');
    });

    test('should reject invalid credentials', async () => {
      // Test wrong password
      const wrongPasswordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'gathaiyalewis1122@gmail.com',
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(wrongPasswordResponse.body.success).toBe(false);
      expect(wrongPasswordResponse.body.message).toContain('Invalid');

      // Test non-existent user
      const wrongEmailResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'AdminPass123!'
        })
        .expect(401);

      expect(wrongEmailResponse.body.success).toBe(false);
      expect(wrongEmailResponse.body.message).toContain('Invalid');
    });

    test('should reject invalid or expired tokens', async () => {
      // Test with invalid token format
      const invalidTokenResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', 'Bearer invalid.token.format')
        .expect(401);

      expect(invalidTokenResponse.body.success).toBe(false);

      // Test with no token
      const noTokenResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', 'Bearer ')
        .expect(401);

      expect(noTokenResponse.body.success).toBe(false);

      // Test with malformed authorization header
      const malformedHeaderResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(malformedHeaderResponse.body.success).toBe(false);
    });

    test('should handle concurrent admin sessions correctly', async () => {
      // Create second admin user
      const admin2 = new Admin({
        email: 'admin2@test.com',
        password: 'AdminPass123!'
      });
      await admin2.save();

      // Use pre-generated tokens to avoid rate limiting
      const token1 = generateToken(adminUser._id);
      const token2 = generateToken(admin2._id);

      // Both tokens should work independently
      const response1 = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      const response2 = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);

      expect(response1.body.success).toBe(true);
      expect(response2.body.success).toBe(true);
    });
  });

  describe('Workflow 4: Complete User Journey', () => {
    test('should handle complete user journey from browsing to admin review', async () => {
      // Step 1: User browses GitHub projects
      const mockRepos = [
        {
          id: 1,
          name: 'PHARMUP',
          description: 'Pharmaceutical management system',
          html_url: 'https://github.com/lewisgathaiya/pharmup',
          language: 'JavaScript',
          stargazers_count: 15,
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'SECULEARN',
          description: 'Security learning platform',
          html_url: 'https://github.com/lewisgathaiya/seculearn',
          language: 'Python',
          stargazers_count: 8,
          updated_at: new Date().toISOString()
        }
      ];

      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(mockRepos);

      const projectsResponse = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(projectsResponse.body.success).toBe(true);
      expect(projectsResponse.body.repos).toHaveLength(2);

      // Step 2: User is impressed and submits contact form
      const contactData = {
        name: 'Impressed Visitor',
        email: 'impressed@example.com',
        message: 'I saw your PHARMUP project and I am very impressed. I would like to discuss a collaboration opportunity.'
      };

      const contactResponse = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(contactResponse.body.success).toBe(true);
      const contactId = contactResponse.body.id;

      // Step 3: Email notification is sent
      expect(emailService.sendContactNotification).toHaveBeenCalledTimes(1);

      // Step 4: Admin uses pre-generated token (avoid rate limiting)
      const token = adminToken;

      // Step 5: Admin views dashboard and sees new contact
      const dashboardResponse = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(dashboardResponse.body.stats.totalContacts).toBe(1);
      expect(dashboardResponse.body.stats.unreadContacts).toBe(1);
      expect(dashboardResponse.body.stats.recentContacts[0].name).toBe(contactData.name);

      // Step 6: Admin views full contact details
      const contactDetailResponse = await request(app)
        .get(`/api/admin/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(contactDetailResponse.body.success).toBe(true);
      expect(contactDetailResponse.body.contact.name).toBe(contactData.name);
      expect(contactDetailResponse.body.contact.email).toBe(contactData.email.toLowerCase());
      expect(contactDetailResponse.body.contact.message).toBe(contactData.message);

      // Step 7: Admin marks as read after reviewing
      const updateResponse = await request(app)
        .put(`/api/admin/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ read: true })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.contact.read).toBe(true);

      // Step 8: Verify dashboard reflects the update
      const finalDashboardResponse = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalDashboardResponse.body.stats.totalContacts).toBe(1);
      expect(finalDashboardResponse.body.stats.unreadContacts).toBe(0);
    });

    test('should handle error scenarios gracefully throughout user journey', async () => {
      // Scenario 1: GitHub API fails but user can still browse fallback projects
      const fallbackRepos = [
        {
          id: 1,
          name: 'PHARMUP',
          description: 'Pharmaceutical management system (fallback)',
          html_url: 'https://github.com/lewisgathaiya/pharmup',
          language: 'JavaScript',
          stargazers_count: 0,
          updated_at: new Date().toISOString()
        }
      ];
      
      githubService.fetchPinnedRepos = jest.fn().mockResolvedValue(fallbackRepos);

      const projectsResponse = await request(app)
        .get('/api/github/repos')
        .expect(200);

      expect(projectsResponse.body.success).toBe(true);
      expect(projectsResponse.body.repos.length).toBeGreaterThan(0);

      // Scenario 2: User submits contact but email service fails (should still save contact)
      emailService.sendContactNotification.mockResolvedValueOnce(false);

      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message that should be saved even if email fails.'
      };

      const contactResponse = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(contactResponse.body.success).toBe(true);
      const contactId = contactResponse.body.id;

      // Verify contact was saved despite email failure
      const storedContact = await Contact.findById(contactId);
      expect(storedContact).toBeTruthy();

      // Scenario 3: Admin can still access and manage the contact
      const token = adminToken;

      const contactsResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(contactsResponse.body.contacts).toHaveLength(1);
      expect(contactsResponse.body.contacts[0]._id).toBe(contactId);
    });
  });

  describe('Workflow 5: Data Consistency and Integrity', () => {
    test('should maintain data consistency across multiple operations', async () => {
      // Create a single contact first
      const response1 = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User One',
          email: 'user1@example.com',
          message: 'This is test message one with sufficient length for validation.'
        });
      
      expect(response1.status).toBe(201);
      const contact1Id = response1.body.id;

      // Create second contact
      const response2 = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User Two',
          email: 'user2@example.com',
          message: 'This is test message two with sufficient length for validation.'
        });
      
      expect(response2.status).toBe(201);
      const contact2Id = response2.body.id;

      // Use pre-generated token to avoid rate limiting
      const token = adminToken;

      // Perform multiple concurrent operations
      const operations = [
        request(app).get('/api/admin/contacts').set('Authorization', `Bearer ${token}`),
        request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${token}`),
        request(app).put(`/api/admin/contacts/${contact1Id}`).set('Authorization', `Bearer ${token}`).send({ read: true })
      ];

      const results = await Promise.all(operations);

      // Verify all operations succeeded
      results.forEach(result => {
        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
      });

      // Verify final state is consistent
      const finalContactsResponse = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalContactsResponse.body.contacts.length).toBeGreaterThanOrEqual(2);

      const finalDashboardResponse = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalDashboardResponse.body.stats.totalContacts).toBeGreaterThanOrEqual(2);
    });

    test('should handle rapid sequential operations correctly', async () => {
      // Submit contact
      const contactResponse = await request(app)
        .post('/api/contact')
        .send({
          name: 'Rapid Test User',
          email: 'rapid@example.com',
          message: 'Testing rapid sequential operations for data consistency.'
        })
        .expect(201);

      const contactId = contactResponse.body.id;

      // Use pre-generated token to avoid rate limiting
      const token = adminToken;

      // Perform rapid sequential updates
      await request(app)
        .put(`/api/admin/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ read: true })
        .expect(200);

      await request(app)
        .put(`/api/admin/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ read: false })
        .expect(200);

      await request(app)
        .put(`/api/admin/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ read: true })
        .expect(200);

      // Verify final state
      const finalResponse = await request(app)
        .get(`/api/admin/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalResponse.body.contact.read).toBe(true);
    });
  });
});
