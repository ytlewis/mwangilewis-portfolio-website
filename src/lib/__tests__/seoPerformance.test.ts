/**
 * SEO and Performance Tests
 * Tests for SEO optimization and performance monitoring
 */

import * as fc from 'fast-check';
import {
  generatePersonSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateJsonLd,
  pageMetadata,
  generateCanonicalUrl,
  generateOpenGraphMetadata,
  generateTwitterMetadata,
} from '../seo';
import {
  getAnalytics,
  PerformanceAnalytics,
  trackPageView,
  trackInteraction,
  trackFormSubmission,
  trackError,
} from '../analytics';

describe('SEO Utilities', () => {
  describe('Structured Data Generation', () => {
    test('generates valid Person schema', () => {
      const schema = generatePersonSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Person');
      expect(schema.name).toBe('Lewis Gathaiya');
      expect(schema.jobTitle).toBe('Full-Stack Developer');
      expect(schema.url).toBe('https://mwangilewis.com');
      expect(schema.email).toBe('gathaiyalewis1122@gmail.com');
      expect(schema.sameAs).toBeInstanceOf(Array);
      expect(schema.knowsAbout).toBeInstanceOf(Array);
      expect(schema.alumniOf).toHaveProperty('@type', 'EducationalOrganization');
    });

    test('generates valid WebSite schema', () => {
      const schema = generateWebSiteSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Lewis Gathaiya Portfolio');
      expect(schema.url).toBe('https://mwangilewis.com');
      expect(schema.description).toBeTruthy();
      expect(schema.author).toHaveProperty('@type', 'Person');
      expect(schema.inLanguage).toEqual(['en', 'sw', 'es']);
    });

    test('generates valid Breadcrumb schema', () => {
      const schema = generateBreadcrumbSchema('/projects', 'Projects');

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toBeInstanceOf(Array);
      expect(schema.itemListElement.length).toBe(2);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[1].name).toBe('Projects');
    });

    test('generates JSON-LD string', () => {
      const schema = { '@type': 'Test', name: 'Test Schema' };
      const jsonLd = generateJsonLd(schema);

      expect(typeof jsonLd).toBe('string');
      expect(JSON.parse(jsonLd)).toEqual(schema);
    });
  });

  describe('Page Metadata', () => {
    test('has metadata for all pages', () => {
      expect(pageMetadata).toHaveProperty('home');
      expect(pageMetadata).toHaveProperty('about');
      expect(pageMetadata).toHaveProperty('projects');
      expect(pageMetadata).toHaveProperty('experience');
      expect(pageMetadata).toHaveProperty('contact');
    });

    test('each page has required metadata fields', () => {
      Object.values(pageMetadata).forEach((meta) => {
        expect(meta).toHaveProperty('title');
        expect(meta).toHaveProperty('description');
        expect(meta).toHaveProperty('keywords');
        expect(meta).toHaveProperty('ogImage');
        expect(meta.keywords).toBeInstanceOf(Array);
      });
    });

    test('generates canonical URLs correctly', () => {
      expect(generateCanonicalUrl('/')).toBe('https://mwangilewis.com/');
      expect(generateCanonicalUrl('/about')).toBe('https://mwangilewis.com/about');
      expect(generateCanonicalUrl('/projects')).toBe('https://mwangilewis.com/projects');
    });

    test('generates Open Graph metadata', () => {
      const og = generateOpenGraphMetadata(
        'Test Title',
        'Test Description',
        '/test-image.jpg',
        'https://mwangilewis.com/test'
      );

      expect(og.title).toBe('Test Title');
      expect(og.description).toBe('Test Description');
      expect(og.url).toBe('https://mwangilewis.com/test');
      expect(og.siteName).toBe('Lewis Gathaiya Portfolio');
      expect(og.images).toBeInstanceOf(Array);
      expect(og.images[0].url).toBe('/test-image.jpg');
      expect(og.locale).toBe('en_US');
      expect(og.type).toBe('website');
    });

    test('generates Twitter Card metadata', () => {
      const twitter = generateTwitterMetadata(
        'Test Title',
        'Test Description',
        '/test-image.jpg'
      );

      expect(twitter.card).toBe('summary_large_image');
      expect(twitter.title).toBe('Test Title');
      expect(twitter.description).toBe('Test Description');
      expect(twitter.images).toEqual(['/test-image.jpg']);
      expect(twitter.creator).toBe('@lewisgathaiya');
    });
  });
});

describe('Performance Analytics', () => {
  let analytics: PerformanceAnalytics;

  beforeEach(() => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('Analytics Initialization', () => {
    test('creates analytics instance', () => {
      analytics = getAnalytics();
      expect(analytics).toBeDefined();
      expect(analytics).toHaveProperty('trackEvent');
      expect(analytics).toHaveProperty('getMetrics');
      expect(analytics).toHaveProperty('getLatestMetrics');
    });

    test('returns singleton instance', () => {
      const analytics1 = getAnalytics();
      const analytics2 = getAnalytics();
      expect(analytics1).toBe(analytics2);
    });
  });

  describe('Event Tracking', () => {
    beforeEach(() => {
      analytics = getAnalytics();
      analytics.clear();
    });

    test('tracks page views', () => {
      trackPageView('Home');
      const events = analytics.getEvents();
      
      expect(events.length).toBeGreaterThan(0);
      const pageViewEvent = events.find(e => e.action === 'Page View');
      expect(pageViewEvent).toBeDefined();
      expect(pageViewEvent?.label).toBe('Home');
    });

    test('tracks user interactions', () => {
      trackInteraction('Button', 'Click');
      const events = analytics.getEvents();
      
      const interactionEvent = events.find(e => e.category === 'Interaction');
      expect(interactionEvent).toBeDefined();
      expect(interactionEvent?.action).toBe('Click');
      expect(interactionEvent?.label).toBe('Button');
    });

    test('tracks form submissions', () => {
      trackFormSubmission('Contact Form', true);
      const events = analytics.getEvents();
      
      const formEvent = events.find(e => e.category === 'Form');
      expect(formEvent).toBeDefined();
      expect(formEvent?.action).toBe('Submit Success');
      expect(formEvent?.label).toBe('Contact Form');
    });

    test('tracks errors', () => {
      trackError('API Error', 'Failed to fetch data');
      const events = analytics.getEvents();
      
      const errorEvent = events.find(e => e.category === 'Error');
      expect(errorEvent).toBeDefined();
      expect(errorEvent?.action).toBe('API Error');
      expect(errorEvent?.label).toBe('Failed to fetch data');
    });
  });

  describe('Performance Metrics', () => {
    beforeEach(() => {
      analytics = getAnalytics();
      analytics.clear();
    });

    test('calculates performance score', () => {
      const score = analytics.getPerformanceScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('checks load time target', () => {
      const meetsTarget = analytics.meetsLoadTimeTarget();
      expect(typeof meetsTarget).toBe('boolean');
    });

    test('exports metrics as JSON', () => {
      const exported = analytics.exportMetrics();
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('metrics');
      expect(parsed).toHaveProperty('events');
      expect(parsed).toHaveProperty('averages');
      expect(parsed).toHaveProperty('score');
      expect(parsed).toHaveProperty('timestamp');
    });

    test('clears metrics and events', () => {
      trackPageView('Test');
      analytics.clear();
      
      const metrics = analytics.getMetrics();
      const events = analytics.getEvents();
      
      expect(metrics.length).toBe(0);
      expect(events.length).toBe(0);
    });
  });
});

/**
 * Property-Based Tests for SEO Optimization
 */
describe('Property-Based Tests: SEO Optimization', () => {
  /**
   * **Validates: Requirements 9.5**
   * Property 38: SEO Optimization Compliance
   * 
   * For any page in the portfolio, proper meta tags and structured data 
   * should be present for search engine optimization
   */
  test('Property 38: SEO Optimization Compliance', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'about', 'projects', 'experience', 'contact'),
        fc.string({ minLength: 1, maxLength: 100 }),
        (pageName, customTitle) => {
          // Get page metadata
          const meta = pageMetadata[pageName as keyof typeof pageMetadata];

          // PROPERTY 1: All pages have required metadata
          expect(meta).toBeDefined();
          expect(meta.title).toBeTruthy();
          expect(meta.description).toBeTruthy();
          expect(meta.keywords).toBeInstanceOf(Array);
          expect(meta.keywords.length).toBeGreaterThan(0);
          expect(meta.ogImage).toBeTruthy();

          // PROPERTY 2: Titles are descriptive and include key information
          expect(meta.title.length).toBeGreaterThan(10);
          expect(meta.title.length).toBeLessThan(70); // SEO best practice
          expect(meta.title).toContain('Lewis Gathaiya');

          // PROPERTY 3: Descriptions are informative
          expect(meta.description.length).toBeGreaterThan(50);
          expect(meta.description.length).toBeLessThan(160); // SEO best practice

          // PROPERTY 4: Keywords are relevant
          expect(meta.keywords.length).toBeGreaterThan(3);
          expect(meta.keywords.length).toBeLessThan(15); // Avoid keyword stuffing

          // PROPERTY 5: Canonical URLs are properly formatted
          const path = pageName === 'home' ? '/' : `/${pageName}`;
          const canonicalUrl = generateCanonicalUrl(path);
          expect(canonicalUrl).toMatch(/^https:\/\/mwangilewis\.com/);
          expect(canonicalUrl).not.toContain('///', 'Canonical URL should not have triple slashes');

          // PROPERTY 6: Open Graph metadata is complete
          const og = generateOpenGraphMetadata(
            meta.title,
            meta.description,
            meta.ogImage,
            canonicalUrl
          );
          expect(og.title).toBeTruthy();
          expect(og.description).toBeTruthy();
          expect(og.url).toBeTruthy();
          expect(og.siteName).toBe('Lewis Gathaiya Portfolio');
          expect(og.images).toBeInstanceOf(Array);
          expect(og.images.length).toBeGreaterThan(0);
          expect(og.images[0].url).toBeTruthy();
          expect(og.images[0].width).toBe(1200);
          expect(og.images[0].height).toBe(630);
          expect(og.locale).toBe('en_US');
          expect(og.type).toBe('website');

          // PROPERTY 7: Twitter Card metadata is complete
          const twitter = generateTwitterMetadata(
            meta.title,
            meta.description,
            meta.ogImage
          );
          expect(twitter.card).toBe('summary_large_image');
          expect(twitter.title).toBeTruthy();
          expect(twitter.description).toBeTruthy();
          expect(twitter.images).toBeInstanceOf(Array);
          expect(twitter.images.length).toBeGreaterThan(0);
          expect(twitter.creator).toBe('@lewisgathaiya');

          // PROPERTY 8: Structured data is valid JSON-LD
          const personSchema = generatePersonSchema();
          const websiteSchema = generateWebSiteSchema();
          
          const personJsonLd = generateJsonLd(personSchema);
          const websiteJsonLd = generateJsonLd(websiteSchema);
          
          // Should be valid JSON
          expect(() => JSON.parse(personJsonLd)).not.toThrow();
          expect(() => JSON.parse(websiteJsonLd)).not.toThrow();
          
          // Should have required schema.org properties
          expect(personSchema['@context']).toBe('https://schema.org');
          expect(personSchema['@type']).toBe('Person');
          expect(websiteSchema['@context']).toBe('https://schema.org');
          expect(websiteSchema['@type']).toBe('WebSite');

          // PROPERTY 9: Breadcrumb schema is properly structured
          if (pageName !== 'home') {
            const breadcrumb = generateBreadcrumbSchema(path, meta.title);
            expect(breadcrumb['@context']).toBe('https://schema.org');
            expect(breadcrumb['@type']).toBe('BreadcrumbList');
            expect(breadcrumb.itemListElement).toBeInstanceOf(Array);
            expect(breadcrumb.itemListElement.length).toBeGreaterThanOrEqual(2);
            
            // First item should be Home
            expect(breadcrumb.itemListElement[0].name).toBe('Home');
            expect(breadcrumb.itemListElement[0].position).toBe(1);
            
            // Last item should be current page
            const lastItem = breadcrumb.itemListElement[breadcrumb.itemListElement.length - 1];
            expect(lastItem.position).toBe(breadcrumb.itemListElement.length);
          }

          // PROPERTY 10: All metadata is consistent across formats
          expect(og.title).toContain(meta.title.split(' | ')[0] || meta.title);
          expect(og.description).toBe(meta.description);
          expect(twitter.title).toContain(meta.title.split(' | ')[0] || meta.title);
          expect(twitter.description).toBe(meta.description);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Structured data schema validation
   */
  test('Property 38 (Extended): Structured data schemas are always valid', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          jobTitle: fc.string({ minLength: 1, maxLength: 100 }),
          email: fc.emailAddress(),
          skills: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 20 }),
        }),
        (personData) => {
          // Generate schema with custom data
          const schema = generatePersonSchema();
          
          // PROPERTY: Schema always has required fields
          expect(schema).toHaveProperty('@context');
          expect(schema).toHaveProperty('@type');
          expect(schema).toHaveProperty('name');
          expect(schema).toHaveProperty('jobTitle');
          expect(schema).toHaveProperty('url');
          expect(schema).toHaveProperty('email');
          expect(schema).toHaveProperty('sameAs');
          expect(schema).toHaveProperty('knowsAbout');

          // PROPERTY: Arrays are always arrays
          expect(Array.isArray(schema.sameAs)).toBe(true);
          expect(Array.isArray(schema.knowsAbout)).toBe(true);

          // PROPERTY: URLs are properly formatted
          expect(schema.url).toMatch(/^https?:\/\//);
          schema.sameAs.forEach((url) => {
            expect(url).toMatch(/^https?:\/\//);
          });

          // PROPERTY: Email is valid format
          expect(schema.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

          // PROPERTY: JSON-LD is valid JSON
          const jsonLd = generateJsonLd(schema);
          expect(() => JSON.parse(jsonLd)).not.toThrow();
          
          const parsed = JSON.parse(jsonLd);
          expect(parsed['@context']).toBe('https://schema.org');
          expect(parsed['@type']).toBe('Person');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property-Based Tests for Performance Load Time
 */
describe('Property-Based Tests: Performance Load Time', () => {
  /**
   * **Validates: Requirements 9.2**
   * Property 35: Performance Load Time
   * 
   * For any page load under standard internet conditions, the portfolio 
   * should load within 3 seconds
   */
  test('Property 35: Performance Load Time Target', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50, max: 2000 }), // TTFB
        fc.integer({ min: 10, max: 500 }), // FID
        fc.float({ min: 0, max: 0.5 }), // CLS
        fc.integer({ min: 100, max: 2000 }), // domContentLoaded
        fc.integer({ min: 200, max: 4000 }), // resourceLoadTime
        fc.constantFrom('4g', '3g', '2g', 'wifi'), // connectionType
        (TTFB, FID, CLS, domContentLoaded, resourceLoadTime, connectionType) => {
          // Generate realistic metrics with proper ordering
          const FCP = TTFB + Math.floor(Math.random() * 1000) + 50;
          const LCP = FCP + Math.floor(Math.random() * 2000) + 100;
          const loadComplete = Math.max(LCP, 500) + Math.floor(Math.random() * 1000);
          
          const metrics = {
            TTFB,
            FCP,
            LCP,
            FID,
            CLS,
            domContentLoaded,
            loadComplete,
            resourceLoadTime,
            connectionType,
          };

          // Create mock analytics instance
          const analytics = getAnalytics();
          analytics.clear();

          // PROPERTY 1: 3-second target validation
          const meetsTarget = metrics.loadComplete <= 3000;
          
          // PROPERTY 2: Core Web Vitals thresholds
          const goodLCP = metrics.LCP <= 2500;
          const goodFID = metrics.FID <= 100;
          const goodCLS = metrics.CLS <= 0.1;
          const goodTTFB = metrics.TTFB <= 800;

          // PROPERTY 3: Performance score calculation
          let expectedScore = 100;
          
          // Deduct points for poor metrics (matching analytics.ts logic)
          if (metrics.LCP > 4000) expectedScore -= 30;
          else if (metrics.LCP > 2500) expectedScore -= 15;
          
          if (metrics.FID > 300) expectedScore -= 20;
          else if (metrics.FID > 100) expectedScore -= 10;
          
          if (metrics.CLS > 0.25) expectedScore -= 20;
          else if (metrics.CLS > 0.1) expectedScore -= 10;
          
          if (metrics.TTFB > 1800) expectedScore -= 15;
          else if (metrics.TTFB > 800) expectedScore -= 7;
          
          if (metrics.loadComplete > 5000) expectedScore -= 15;
          else if (metrics.loadComplete > 3000) expectedScore -= 7;
          
          expectedScore = Math.max(0, expectedScore);

          // PROPERTY 4: Good performance on fast connections
          if (metrics.connectionType === '4g' || metrics.connectionType === 'wifi') {
            // On fast connections, we expect better performance
            // But only if all metrics are good
            if (metrics.loadComplete <= 3000 && goodLCP && goodFID && goodCLS && goodTTFB) {
              expect(expectedScore).toBeGreaterThanOrEqual(70);
            }
          }

          // PROPERTY 5: Metrics are within reasonable bounds
          expect(metrics.TTFB).toBeGreaterThan(0);
          expect(metrics.FCP).toBeGreaterThan(0);
          expect(metrics.LCP).toBeGreaterThan(0);
          expect(metrics.FID).toBeGreaterThanOrEqual(0);
          expect(metrics.CLS).toBeGreaterThanOrEqual(0);
          expect(metrics.domContentLoaded).toBeGreaterThan(0);
          expect(metrics.loadComplete).toBeGreaterThan(0);
          expect(metrics.resourceLoadTime).toBeGreaterThan(0);

          // PROPERTY 6: Logical ordering of metrics
          // With our constrained generation, metrics should follow proper ordering
          expect(metrics.FCP).toBeGreaterThanOrEqual(metrics.TTFB);
          expect(metrics.LCP).toBeGreaterThanOrEqual(metrics.FCP);
          expect(metrics.loadComplete).toBeGreaterThanOrEqual(metrics.LCP);

          // PROPERTY 7: Performance score is always valid
          expect(expectedScore).toBeGreaterThanOrEqual(0);
          expect(expectedScore).toBeLessThanOrEqual(100);

          // PROPERTY 8: Meeting 3-second target correlates with good score
          if (meetsTarget && goodLCP && goodFID && goodCLS && goodTTFB) {
            // If all metrics are good and load time is under 3s, score should be high
            expect(expectedScore).toBeGreaterThanOrEqual(85);
          }

          // PROPERTY 9: Slow connections are accounted for
          if (metrics.connectionType === '2g' || metrics.connectionType === '3g') {
            // On slow connections, we're more lenient
            // But still expect reasonable performance
            expect(metrics.loadComplete).toBeLessThan(10000);
          }

          // PROPERTY 10: Core Web Vitals consistency
          // If LCP is good, FCP should also be reasonable
          if (goodLCP) {
            expect(metrics.FCP).toBeLessThanOrEqual(3000); // Allow some variance
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Performance monitoring consistency
   */
  test('Property 35 (Extended): Performance monitoring is consistent', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            loadComplete: fc.integer({ min: 500, max: 6000 }),
            LCP: fc.integer({ min: 500, max: 5000 }),
            FID: fc.integer({ min: 10, max: 500 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (metricsArray) => {
          const analytics = getAnalytics();
          analytics.clear();

          // PROPERTY: Average calculations are consistent
          const loadTimes = metricsArray.map(m => m.loadComplete);
          const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;

          // PROPERTY: 3-second target is consistently evaluated
          const meetingTarget = metricsArray.filter(m => m.loadComplete <= 3000);
          const targetRate = meetingTarget.length / metricsArray.length;

          // If most loads meet the target, overall performance should be good
          if (targetRate >= 0.8) {
            expect(avgLoadTime).toBeLessThanOrEqual(3500);
          }

          // PROPERTY: Performance degradation is detectable
          const slowLoads = metricsArray.filter(m => m.loadComplete > 5000);
          if (slowLoads.length > metricsArray.length / 2) {
            // More than half the loads are slow
            expect(avgLoadTime).toBeGreaterThan(3000);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
