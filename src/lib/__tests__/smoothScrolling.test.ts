import * as fc from 'fast-check';
import { initSmoothScrolling } from '../animations';

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    to: jest.fn(),
    registerPlugin: jest.fn(),
  },
}));

// Mock ScrollToPlugin
jest.mock('gsap/ScrollToPlugin', () => ({
  ScrollToPlugin: {},
}));

describe('Smooth Scrolling Implementation', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    document.documentElement.innerHTML = '<head></head><body></body>';
    
    // Mock window.scrollTo
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
    document.documentElement.innerHTML = '<head></head><body></body>';
  });

  test('Property 7: Smooth Scrolling Implementation - For any scroll event, the scrolling behavior should be smooth and animated rather than instant', () => {
    // Feature: lewis-portfolio-website, Property 7: Smooth Scrolling Implementation
    fc.assert(fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }),
      (sectionIds) => {
        const { gsap } = require('gsap');
        
        // Create test sections with anchor links
        const sections = sectionIds.map(id => {
          const section = document.createElement('div');
          section.id = id;
          section.style.height = '500px';
          section.textContent = `Section ${id}`;
          document.body.appendChild(section);
          return section;
        });

        // Create anchor links pointing to sections
        const links = sectionIds.map(id => {
          const link = document.createElement('a');
          link.href = `#${id}`;
          link.textContent = `Go to ${id}`;
          document.body.appendChild(link);
          return link;
        });

        // Initialize smooth scrolling
        initSmoothScrolling();

        // Test each link
        links.forEach((link, index) => {
          const targetId = sectionIds[index];
          const targetSection = sections[index];

          // Clear previous mock calls
          jest.clearAllMocks();

          // Simulate click on anchor link
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          });

          // Prevent default should be called to override browser's default scroll behavior
          const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
          
          link.dispatchEvent(clickEvent);

          // Verify preventDefault was called to override default scroll behavior
          expect(preventDefaultSpy).toHaveBeenCalled();

          // Verify GSAP.to was called for smooth scrolling animation
          expect(gsap.to).toHaveBeenCalledWith(window, expect.objectContaining({
            duration: expect.any(Number),
            scrollTo: expect.objectContaining({
              y: targetSection,
              offsetY: expect.any(Number),
            }),
            ease: expect.any(String),
          }));

          // Verify the duration is reasonable for smooth scrolling (not instant)
          const gsapCall = (gsap.to as jest.Mock).mock.calls[0];
          if (gsapCall) {
            const options = gsapCall[1];
            expect(options.duration).toBeGreaterThan(0);
            expect(options.duration).toBeLessThanOrEqual(3); // Reasonable upper bound
          }
        });

        // Clean up for next iteration
        document.body.innerHTML = '';
      }
    ), { numRuns: 100 });
  });

  test('Property 7: Smooth Scrolling Implementation - Smooth scrolling should be enabled globally on document', () => {
    // Feature: lewis-portfolio-website, Property 7: Smooth Scrolling Implementation
    fc.assert(fc.property(
      fc.constant(true), // Simple property that always runs
      () => {
        // Initialize smooth scrolling
        initSmoothScrolling();

        // Verify that smooth scrolling is enabled on the document
        const scrollBehavior = document.documentElement.style.scrollBehavior;
        expect(scrollBehavior).toBe('smooth');

        // Clean up for next iteration
        document.documentElement.style.scrollBehavior = '';
      }
    ), { numRuns: 100 });
  });

  test('Property 7: Smooth Scrolling Implementation - Anchor links should be processed and have event listeners attached', () => {
    // Feature: lewis-portfolio-website, Property 7: Smooth Scrolling Implementation
    fc.assert(fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 15 }).filter(s => s.trim().length > 0 && !s.includes('#')), { minLength: 1, maxLength: 3 }),
      (linkTargets) => {
        // Create anchor links
        const links = linkTargets.map(target => {
          const link = document.createElement('a');
          link.href = `#${target}`;
          link.textContent = `Link to ${target}`;
          document.body.appendChild(link);
          return link;
        });

        // Create corresponding target elements
        linkTargets.forEach(target => {
          const targetElement = document.createElement('div');
          targetElement.id = target;
          targetElement.style.height = '300px';
          document.body.appendChild(targetElement);
        });

        // Initialize smooth scrolling
        initSmoothScrolling();

        // Test that each link has proper event handling
        links.forEach(link => {
          // Verify the link exists and has the correct href
          expect(link.getAttribute('href')).toMatch(/^#.+/);
          
          // Verify that clicking the link triggers smooth scrolling behavior
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          });

          const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
          link.dispatchEvent(clickEvent);

          // Should prevent default browser scroll behavior
          expect(preventDefaultSpy).toHaveBeenCalled();
        });

        // Clean up for next iteration
        document.body.innerHTML = '';
      }
    ), { numRuns: 100 });
  });

  test('Property 7: Smooth Scrolling Implementation - Should handle invalid or missing target elements gracefully', () => {
    // Feature: lewis-portfolio-website, Property 7: Smooth Scrolling Implementation
    fc.assert(fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 3 }),
      (invalidTargets) => {
        const { gsap } = require('gsap');
        
        // Create anchor links pointing to non-existent targets
        const links = invalidTargets.map(target => {
          const link = document.createElement('a');
          link.href = `#nonexistent-${target}`;
          link.textContent = `Invalid link ${target}`;
          document.body.appendChild(link);
          return link;
        });

        // Initialize smooth scrolling
        initSmoothScrolling();

        // Test each invalid link
        links.forEach(link => {
          jest.clearAllMocks();

          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          });

          const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
          
          // Should not throw an error when target doesn't exist
          expect(() => {
            link.dispatchEvent(clickEvent);
          }).not.toThrow();

          // Should still prevent default behavior
          expect(preventDefaultSpy).toHaveBeenCalled();

          // Should not call GSAP.to when target doesn't exist
          expect(gsap.to).not.toHaveBeenCalled();
        });

        // Clean up for next iteration
        document.body.innerHTML = '';
      }
    ), { numRuns: 100 });
  });
});