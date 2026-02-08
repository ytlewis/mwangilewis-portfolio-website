/**
 * Property-Based Tests for Responsive Design Compliance
 * Tests Property 34: Responsive Design Compliance
 * Validates: Requirements 9.1
 */

import * as fc from 'fast-check';
import {
  getDeviceCapabilities,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  getOptimalAnimationSettings,
  getOptimalParticleCount,
} from '../performance';

// Mock window and navigator for testing
const mockWindow = (props: Partial<Window>) => {
  Object.defineProperty(global, 'window', {
    writable: true,
    value: {
      ...global.window,
      ...props,
      matchMedia: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    },
  });
};

const mockNavigator = (props: Partial<Navigator>) => {
  Object.defineProperty(global, 'navigator', {
    writable: true,
    value: {
      ...global.navigator,
      ...props,
    },
  });
};

describe('Property 34: Responsive Design Compliance', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockNavigator({ userAgent: 'Mozilla/5.0', hardwareConcurrency: 4 });
  });

  test('Property 34: Responsive Design Compliance - **Validates: Requirements 9.1**', () => {
    /**
     * **Property 34: Responsive Design Compliance**
     * **Validates: Requirements 9.1**
     * 
     * For any screen size (desktop, tablet, mobile), the portfolio should maintain 
     * full functionality and appropriate layout
     * 
     * This property verifies that:
     * 1. Device detection correctly identifies device type based on screen width
     * 2. Only one device type is active at a time (mutually exclusive)
     * 3. Device capabilities are properly determined for each screen size
     * 4. Layout optimizations are appropriate for each device type
     */

    fc.assert(
      fc.property(
        // Generate arbitrary screen widths covering all device types
        fc.integer({ min: 320, max: 3840 }),
        (screenWidth) => {
          // Mock the window with the generated screen width
          mockWindow({ innerWidth: screenWidth });

          // Get device capabilities
          const capabilities = getDeviceCapabilities();

          // Property 1: Device type should be correctly identified based on screen width
          if (screenWidth < 768) {
            // Mobile devices: width < 768px
            expect(capabilities.isMobile).toBe(true);
            expect(capabilities.isTablet).toBe(false);
            expect(capabilities.isDesktop).toBe(false);
          } else if (screenWidth >= 768 && screenWidth < 1024) {
            // Tablet devices: 768px <= width < 1024px
            expect(capabilities.isMobile).toBe(false);
            expect(capabilities.isTablet).toBe(true);
            expect(capabilities.isDesktop).toBe(false);
          } else {
            // Desktop devices: width >= 1024px
            expect(capabilities.isMobile).toBe(false);
            expect(capabilities.isTablet).toBe(false);
            expect(capabilities.isDesktop).toBe(true);
          }

          // Property 2: Exactly one device type should be true (mutually exclusive)
          const deviceTypeCount = [
            capabilities.isMobile,
            capabilities.isTablet,
            capabilities.isDesktop,
          ].filter(Boolean).length;
          expect(deviceTypeCount).toBe(1);

          // Property 3: Device capabilities should be complete and valid
          expect(capabilities).toHaveProperty('isLowPerformance');
          expect(capabilities).toHaveProperty('isMobile');
          expect(capabilities).toHaveProperty('isTablet');
          expect(capabilities).toHaveProperty('isDesktop');
          expect(capabilities).toHaveProperty('supportsWebGL');
          expect(capabilities).toHaveProperty('hardwareConcurrency');
          expect(capabilities).toHaveProperty('devicePixelRatio');
          expect(capabilities).toHaveProperty('prefersReducedMotion');
          expect(capabilities).toHaveProperty('connectionSpeed');

          // Property 4: Numeric capabilities should be valid
          expect(capabilities.hardwareConcurrency).toBeGreaterThanOrEqual(0);
          expect(capabilities.devicePixelRatio).toBeGreaterThan(0);

          // Property 5: Boolean capabilities should be boolean type
          expect(typeof capabilities.isLowPerformance).toBe('boolean');
          expect(typeof capabilities.isMobile).toBe('boolean');
          expect(typeof capabilities.isTablet).toBe('boolean');
          expect(typeof capabilities.isDesktop).toBe('boolean');
          expect(typeof capabilities.supportsWebGL).toBe('boolean');
          expect(typeof capabilities.prefersReducedMotion).toBe('boolean');

          // Property 6: Connection speed should be one of the valid values
          expect(['slow', 'medium', 'fast']).toContain(capabilities.connectionSpeed);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 34: Responsive Design Compliance - Layout Optimization for Device Types', () => {
    /**
     * Verifies that layout optimizations are appropriate for each device type
     * Mobile devices should have reduced particle counts and simplified animations
     * Tablet devices should have moderate optimizations
     * Desktop devices should have full functionality
     */

    fc.assert(
      fc.property(
        fc.record({
          screenWidth: fc.integer({ min: 320, max: 3840 }),
          baseParticleCount: fc.integer({ min: 50, max: 200 }),
        }),
        ({ screenWidth, baseParticleCount }) => {
          mockWindow({ innerWidth: screenWidth });

          const capabilities = getDeviceCapabilities();
          const optimizedParticleCount = getOptimalParticleCount(baseParticleCount);
          const animationSettings = getOptimalAnimationSettings();

          // Property: Particle count should be reduced for smaller devices
          if (capabilities.isMobile) {
            // Mobile should have significantly reduced particles (40% of base)
            expect(optimizedParticleCount).toBeLessThanOrEqual(baseParticleCount * 0.5);
            expect(optimizedParticleCount).toBeGreaterThanOrEqual(20); // Minimum 20 particles
          } else if (capabilities.isTablet) {
            // Tablet should have moderately reduced particles (60% of base)
            expect(optimizedParticleCount).toBeLessThanOrEqual(baseParticleCount * 0.7);
            expect(optimizedParticleCount).toBeGreaterThanOrEqual(20);
          } else {
            // Desktop should have full or near-full particle count
            expect(optimizedParticleCount).toBeGreaterThanOrEqual(baseParticleCount * 0.5);
          }

          // Property: Animation settings should be appropriate for device type
          expect(animationSettings).toHaveProperty('enableParticles');
          expect(animationSettings).toHaveProperty('enableComplexAnimations');
          expect(animationSettings).toHaveProperty('enableHoverEffects');
          expect(animationSettings).toHaveProperty('enableScrollAnimations');
          expect(animationSettings).toHaveProperty('animationDuration');
          expect(animationSettings).toHaveProperty('particleCount');
          expect(animationSettings).toHaveProperty('maxPixelRatio');

          // Property: Mobile devices should not have hover effects
          if (capabilities.isMobile) {
            expect(animationSettings.enableHoverEffects).toBe(false);
          }

          // Property: Animation duration should be a valid number
          expect(animationSettings.animationDuration).toBeGreaterThanOrEqual(0);
          expect(animationSettings.animationDuration).toBeLessThanOrEqual(1);

          // Property: Animation settings particle count should be from base 100
          // (getOptimalAnimationSettings uses a fixed base of 100)
          const expectedAnimationParticleCount = getOptimalParticleCount(100);
          expect(animationSettings.particleCount).toBe(expectedAnimationParticleCount);

          // Property: Animation particle count should respect device type
          if (capabilities.isMobile) {
            expect(animationSettings.particleCount).toBeLessThanOrEqual(50);
          } else if (capabilities.isTablet) {
            expect(animationSettings.particleCount).toBeLessThanOrEqual(70);
          }

          // Property: Max pixel ratio should be appropriate for device
          if (capabilities.isMobile) {
            expect(animationSettings.maxPixelRatio).toBeLessThanOrEqual(1.5);
          } else {
            expect(animationSettings.maxPixelRatio).toBeLessThanOrEqual(2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 34: Responsive Design Compliance - Functionality Maintained Across All Screen Sizes', () => {
    /**
     * Verifies that core functionality is maintained across all screen sizes
     * All device types should have access to essential features
     */

    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (screenWidth) => {
          mockWindow({ innerWidth: screenWidth });

          const capabilities = getDeviceCapabilities();
          const animationSettings = getOptimalAnimationSettings();

          // Property: All devices should support scroll animations (unless reduced motion)
          if (!capabilities.prefersReducedMotion) {
            expect(animationSettings.enableScrollAnimations).toBe(true);
          }

          // Property: All devices should have some level of animation
          // Even if complex animations are disabled, basic animations should work
          expect(animationSettings.animationDuration).toBeGreaterThanOrEqual(0);

          // Property: All devices should have at least minimum particle count
          expect(animationSettings.particleCount).toBeGreaterThanOrEqual(20);

          // Property: Device detection functions should be consistent
          const isMobile = isMobileDevice();
          const isTablet = isTabletDevice();
          const isDesktop = isDesktopDevice();

          expect(isMobile).toBe(capabilities.isMobile);
          expect(isTablet).toBe(capabilities.isTablet);
          expect(isDesktop).toBe(capabilities.isDesktop);

          // Property: Exactly one device type should be detected
          const detectedTypes = [isMobile, isTablet, isDesktop].filter(Boolean).length;
          expect(detectedTypes).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 34: Responsive Design Compliance - Boundary Conditions', () => {
    /**
     * Tests boundary conditions between device types
     * Ensures correct classification at breakpoint boundaries
     */

    fc.assert(
      fc.property(
        fc.constantFrom(
          // Test exact breakpoint boundaries
          767,  // Just below tablet breakpoint
          768,  // Tablet breakpoint
          769,  // Just above tablet breakpoint
          1023, // Just below desktop breakpoint
          1024, // Desktop breakpoint
          1025, // Just above desktop breakpoint
          320,  // Minimum mobile width
          375,  // Common mobile width (iPhone)
          414,  // Common mobile width (iPhone Plus)
          768,  // Common tablet width (iPad portrait)
          1024, // Common tablet width (iPad landscape)
          1366, // Common laptop width
          1920, // Common desktop width (Full HD)
          2560, // Common desktop width (2K)
          3840, // Common desktop width (4K)
        ),
        (screenWidth) => {
          mockWindow({ innerWidth: screenWidth });

          const capabilities = getDeviceCapabilities();

          // Verify correct device type at boundaries
          if (screenWidth < 768) {
            expect(capabilities.isMobile).toBe(true);
            expect(capabilities.isTablet).toBe(false);
            expect(capabilities.isDesktop).toBe(false);
          } else if (screenWidth >= 768 && screenWidth < 1024) {
            expect(capabilities.isMobile).toBe(false);
            expect(capabilities.isTablet).toBe(true);
            expect(capabilities.isDesktop).toBe(false);
          } else {
            expect(capabilities.isMobile).toBe(false);
            expect(capabilities.isTablet).toBe(false);
            expect(capabilities.isDesktop).toBe(true);
          }

          // Verify functionality is maintained at boundaries
          const animationSettings = getOptimalAnimationSettings();
          expect(animationSettings.particleCount).toBeGreaterThanOrEqual(20);
          expect(animationSettings.animationDuration).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 34: Responsive Design Compliance - User Agent Detection', () => {
    /**
     * Tests that mobile devices are correctly detected via user agent
     * even if screen width suggests otherwise
     */

    fc.assert(
      fc.property(
        fc.record({
          screenWidth: fc.integer({ min: 768, max: 3840 }), // Non-mobile width
          userAgent: fc.constantFrom(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
            'Mozilla/5.0 (Linux; Android 10)',
            'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          ),
        }),
        ({ screenWidth, userAgent }) => {
          mockWindow({ innerWidth: screenWidth });
          mockNavigator({ userAgent });

          // Mobile user agents should be detected as mobile regardless of screen width
          const isMobile = isMobileDevice();
          expect(isMobile).toBe(true);

          // Animation settings should reflect mobile optimization
          const animationSettings = getOptimalAnimationSettings();
          expect(animationSettings.enableHoverEffects).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 34: Responsive Design Compliance - Consistency Across Multiple Calls', () => {
    /**
     * Verifies that device detection is consistent across multiple calls
     * with the same screen size
     */

    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (screenWidth) => {
          mockWindow({ innerWidth: screenWidth });

          // Call device detection multiple times
          const capabilities1 = getDeviceCapabilities();
          const capabilities2 = getDeviceCapabilities();
          const capabilities3 = getDeviceCapabilities();

          // All calls should return the same device type
          expect(capabilities1.isMobile).toBe(capabilities2.isMobile);
          expect(capabilities1.isMobile).toBe(capabilities3.isMobile);
          expect(capabilities1.isTablet).toBe(capabilities2.isTablet);
          expect(capabilities1.isTablet).toBe(capabilities3.isTablet);
          expect(capabilities1.isDesktop).toBe(capabilities2.isDesktop);
          expect(capabilities1.isDesktop).toBe(capabilities3.isDesktop);

          // Animation settings should also be consistent
          const settings1 = getOptimalAnimationSettings();
          const settings2 = getOptimalAnimationSettings();

          expect(settings1.particleCount).toBe(settings2.particleCount);
          expect(settings1.enableHoverEffects).toBe(settings2.enableHoverEffects);
          expect(settings1.animationDuration).toBe(settings2.animationDuration);
        }
      ),
      { numRuns: 100 }
    );
  });
});
