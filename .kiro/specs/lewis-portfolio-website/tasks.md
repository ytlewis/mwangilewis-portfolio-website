# Implementation Plan: Lewis Portfolio Website

## Overview

This implementation plan breaks down the development of Lewis Gathaiya's portfolio website (mwangilewis.com) into discrete, manageable coding tasks. The approach follows a full-stack development pattern, building the frontend and backend incrementally while ensuring proper testing and integration at each step.

## Tasks

- [x] 1. Project Setup and Core Infrastructure
  - Initialize Next.js project with TypeScript and Tailwind CSS
  - Set up Express.js backend with MongoDB connection
  - Configure development environment and build tools
  - Set up version control and deployment configurations
  - _Requirements: All system requirements foundation_

- [x] 2. Database Models and Validation
  - [x] 2.1 Create MongoDB schemas for User Contact and Admin collections
    - Implement Mongoose schemas with proper validation
    - Add field constraints, indexes, and data sanitization
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 2.2 Write property test for database schema compliance

    - **Property 39: Database Schema Compliance**
    - **Validates: Requirements 10.1, 10.2**

  - [x] 2.3 Write property test for input validation

    - **Property 31: Comprehensive Input Validation**
    - **Validates: Requirements 7.4, 7.6, 10.3**

- [x] 3. Authentication System Implementation
  - [x] 3.1 Implement JWT-based authentication with bcrypt password hashing
    - Create login endpoint with email validation
    - Implement secure password hashing and JWT token generation
    - Add authentication middleware for protected routes
    - _Requirements: 4.1, 4.5, 4.6_

  - [x] 3.2 Write property test for password security

    - **Property 13: Password Security Implementation**
    - **Validates: Requirements 4.6**

  - [x] 3.3 Write property test for JWT token management

    - **Property 14: JWT Token Management**
    - **Validates: Requirements 4.5**

- [x] 4. Security Middleware and Headers
  - [x] 4.1 Configure Helmet.js, CORS, and rate limiting
    - Implement security headers with Helmet.js
    - Configure CORS policies for frontend-backend communication
    - Add rate limiting to prevent abuse
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [x] 4.2 Write property test for security headers

    - **Property 28: Comprehensive Security Headers**
    - **Validates: Requirements 7.1, 7.5**

  - [x] 4.3 Write property test for CORS enforcement

    - **Property 29: CORS Policy Enforcement**
    - **Validates: Requirements 7.2**

  - [x] 4.4 Write property test for rate limiting

    - **Property 30: Rate Limiting Protection**
    - **Validates: Requirements 7.3**

- [x] 5. Contact System Backend
  - [x] 5.1 Create contact form API endpoints
    - Implement POST /api/contact for form submissions
    - Add email notification service with Nodemailer/SendGrid
    - Create admin endpoints for viewing and managing contacts
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 5.2 Write property test for contact data capture

    - **Property 18: Contact Form Data Capture**
    - **Validates: Requirements 5.1**

  - [x] 5.3 Write property test for email notifications

    - **Property 19: Email Notification Delivery**
    - **Validates: Requirements 5.2**

  - [x] 5.4 Write property test for data persistence

    - **Property 22: Contact Data Persistence**
    - **Validates: Requirements 5.5**

- [x] 6. GitHub Integration Service
  - [x] 6.1 Implement GitHub API integration
    - Create service to fetch pinned repositories
    - Add caching mechanism for API responses
    - Implement periodic data refresh functionality
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.2 Write property test for GitHub repository fetching

    - **Property 23: GitHub Repository Fetching**
    - **Validates: Requirements 6.1**

  - [x] 6.3 Write property test for API fallback behavior

    - **Property 25: GitHub API Fallback Behavior**
    - **Validates: Requirements 6.3**

  - [x] 6.4 Write property test for repository information completeness

    - **Property 26: Repository Information Completeness**
    - **Validates: Requirements 6.4**

- [x] 7. Checkpoint - Backend Core Complete
  - Ensure all backend tests pass, verify API endpoints work correctly
  - Test database connections and data operations
  - Verify security middleware is functioning properly

- [x] 8. Frontend Core Layout and Navigation
  - [x] 8.1 Create main layout components and navigation system
    - Implement AppLayout with responsive navigation
    - Add theme toggle and language switcher components
    - Create routing structure for all portfolio pages
    - _Requirements: 3.5, 1.2_

  - [x] 8.2 Write property test for language toggle accessibility

    - **Property 12: Language Toggle Accessibility**
    - **Validates: Requirements 3.5**

  - [x] 8.3 Write property test for theme transitions

    - **Property 2: Theme Transition Completeness**
    - **Validates: Requirements 1.2**

- [x] 9. Theme System Implementation
  - [x] 9.1 Implement comprehensive theming with light/dark mode
    - Create theme context and provider
    - Implement color scheme with #E63946 primary and #FFFFFF background
    - Add smooth transitions between theme modes
    - _Requirements: 1.1, 1.2_

  - [x] 9.2 Write property test for theme color consistency

    - **Property 1: Theme Color Consistency**
    - **Validates: Requirements 1.1**

- [x] 10. Internationalization System
  - [x] 10.1 Set up i18next with English, Swahili, and French support
    - Create JSON translation files for all static content
    - Implement language switching with persistence
    - Add language detection and fallback mechanisms
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 10.2 Write property test for language support completeness

    - **Property 8: Language Support Completeness**
    - **Validates: Requirements 3.1**

  - [x] 10.3 Write property test for language content updates

    - **Property 9: Language Content Updates**
    - **Validates: Requirements 3.2**

  - [x] 10.4 Write property test for language persistence

    - **Property 11: Language Preference Persistence**
    - **Validates: Requirements 3.4**

- [x] 11. Animation Engine Setup
  - [x] 11.1 Implement particle background system with Three.js
    - Create ParticleBackground component with dynamic colors
    - Implement scroll-based background color changes
    - Add performance optimization for different devices
    - _Requirements: 2.1, 2.2_

  - [x] 11.2 Write property test for particle system functionality

    - **Property 4: Particle System Functionality**
    - **Validates: Requirements 2.1**

  - [x] 11.3 Write property test for dynamic background changes


    - **Property 5: Dynamic Background Color Changes**
    - **Validates: Requirements 2.2**

- [x] 12. Interactive Animations and Micro-interactions
  - [x] 12.1 Implement GSAP animations and hover effects
    - Add smooth scrolling with GSAP
    - Create hover animations for images (scale, glow, tilt)
    - Implement button micro-interactions and feedback
    - _Requirements: 2.3, 2.4, 2.5, 1.4_

  - [x] 12.2 Write property test for image hover transformations

    - **Property 6: Image Hover Transformations**
    - **Validates: Requirements 2.3**

  - [x] 12.3 Write property test for smooth scrolling

    - **Property 7: Smooth Scrolling Implementation**
    - **Validates: Requirements 2.4**

  - [x] 12.4 Write property test for interactive animations

    - **Property 3: Interactive Animation Response**
    - **Validates: Requirements 1.4, 2.5**

- [x] 13. Home Page Implementation
  - [x] 13.1 Create hero section with animated name and particle background
    - Implement animated hero section with Lewis's name and title
    - Add call-to-action buttons with micro-interactions
    - Integrate particle background with theme-based colors
    - _Requirements: 8.1_

- [x] 14. About Page with Skills and Timeline
  - [x] 14.1 Implement About page with bio, skills, and education timeline
    - Create skills section with animated progress bars
    - Build education timeline component
    - Add personal information display
    - _Requirements: 8.1, 8.2, 8.5_

  - [x] 14.2 Write property test for skills progress bars

    - **Property 32: Skills Progress Bar Animation**
    - **Validates: Requirements 8.2**

  - [x] 14.3 Write property test for timeline format consistency

    - **Property 33: Timeline Format Consistency**
    - **Validates: Requirements 8.5**

- [x] 15. Projects Page with GitHub Integration
  - [x] 15.1 Create projects showcase with GitHub repository integration
    - Build project cards with hover animations
    - Integrate live GitHub data display
    - Add filtering and search functionality for projects
    - Highlight PHARMUP and SECULEARN projects
    - _Requirements: 6.2, 8.4_

  - [x] 15.2 Write property test for live GitHub data updates

    - **Property 24: Live GitHub Data Updates**
    - **Validates: Requirements 6.2**

- [x] 16. Experience Page Implementation
  - [x] 16.1 Create work experience timeline
    - Build timeline component for work history
    - Display ICT Intern, Call Center Agent, and Volunteer Teacher roles
    - Add interactive timeline navigation
    - _Requirements: 8.3_

- [x] 17. Contact Page and Form
  - [x] 17.1 Implement contact form with validation and notifications
    - Create contact form with name, email, and message fields
    - Add form validation and toast notifications
    - Implement click-to-call functionality for mobile
    - Connect to backend API for form submission
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 17.2 Write property test for user feedback notifications

    - **Property 20: User Feedback Notifications**
    - **Validates: Requirements 5.3**

  - [x] 17.3 Write property test for mobile click-to-call

    - **Property 21: Mobile Click-to-Call Functionality**
    - **Validates: Requirements 5.4**

- [x] 18. Admin Dashboard Implementation
  - [x] 18.1 Create secure admin dashboard for content management
    - Build admin login page with authentication
    - Create dashboard for viewing and managing contact submissions
    - Add functionality to edit and delete user entries
    - Implement dynamic content update capabilities
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 18.2 Write property test for admin data display

    - **Property 15: Admin Dashboard Data Display**
    - **Validates: Requirements 4.2**

  - [x] 18.3 Write property test for admin CRUD operations

    - **Property 16: Admin CRUD Operations**
    - **Validates: Requirements 4.3**

  - [x] 18.4 Write property test for dynamic content updates

    - **Property 17: Dynamic Content Updates**
    - **Validates: Requirements 4.4**

- [x] 19. Responsive Design and Performance Optimization
  - [x] 19.1 Ensure responsive design across all devices
    - Test and optimize layout for desktop, tablet, and mobile
    - Implement performance optimizations for animations
    - Add graceful degradation for lower-performance devices
    - _Requirements: 9.1, 9.3, 9.4_

  - [x] 19.2 Write property test for responsive design compliance

    - **Property 34: Responsive Design Compliance**
    - **Validates: Requirements 9.1**

  - [x] 19.3 Write property test for animation performance

    - **Property 36: Animation Performance Maintenance**
    - **Validates: Requirements 9.3**

  - [x] 19.4 Write property test for performance degradation

    - **Property 37: Performance Graceful Degradation**
    - **Validates: Requirements 9.4**

- [x] 20. SEO and Performance Optimization
  - [x] 20.1 Implement SEO optimization and performance monitoring
    - Add proper meta tags and structured data
    - Optimize loading performance to meet 3-second target
    - Implement performance monitoring and analytics
    - _Requirements: 9.2, 9.5_

  - [x] 20.2 Write property test for performance load time

    - **Property 35: Performance Load Time**
    - **Validates: Requirements 9.2**

  - [x] 20.3 Write property test for SEO optimization

    - **Property 38: SEO Optimization Compliance**
    - **Validates: Requirements 9.5**

- [x] 21. Database Performance and Optimization
  - [x] 21.1 Optimize database queries and implement indexing
    - Add proper database indexes for performance
    - Optimize admin dashboard queries
    - Implement database connection pooling
    - _Requirements: 10.4, 10.5_

  - [x] 21.2 Write property test for query performance

    - **Property 40: Query Performance Optimization**
    - **Validates: Requirements 10.4, 10.5**

- [x] 22. Integration Testing and Final Wiring
  - [x] 22.1 Connect all components and test end-to-end functionality
    - Wire frontend components to backend APIs
    - Test complete user workflows from contact form to admin dashboard
    - Verify GitHub integration and email notifications
    - Test theme switching and language changes across all pages
    - _Requirements: All integration requirements_

  - [x] 22.2 Write integration tests for complete user workflows

    - Test contact form submission to admin dashboard workflow
    - Test GitHub data fetching and display pipeline
    - Test authentication and admin access workflows

- [x] 23. Deployment Configuration
  - [x] 23.1 Set up production deployment configurations
    - Configure Vercel deployment for frontend
    - Set up backend hosting (Railway/Render) with environment variables
    - Configure MongoDB Atlas production database
    - Set up domain configuration for mwangilewis.com
    - _Requirements: Production deployment_

- [x] 24. Final Checkpoint - Complete System Testing
  - Ensure all tests pass across frontend and backend
  - Verify all 40 correctness properties are validated
  - Test complete system functionality in production environment
  - Confirm all requirements are met and documented

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP development
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties with minimum 100 iterations
- Unit tests complement property tests by covering specific examples and edge cases
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows a full-stack approach, building backend services first, then frontend components, and finally integrating everything together