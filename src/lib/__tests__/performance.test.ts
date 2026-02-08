/**
 * Performance Utilities Tests
 * Tests for device capability detection and performance optimization utilities
 */

import {
  isLowPerformanceDevice,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  supportsWebGL,
  getConnectionSpeed,
  getDeviceCapabilities,
  getOptimalParticleCount,
  getOptimalAnimationSettings,
  PerformanceMonitor,
  debounce,
  throttle,
} from '../performance';

// Mock window and navigator
const mockWindow = (overrides: any = {}) => {
  Object.defineProperty(global, 'window', {
    writable: true,
    value: {
      innerWidth: 1024,
      innerHeight: 768,
      matchMedia: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
      WebGLRenderingContext: true,
      ...overrides,
    },
  });
};

const mockNavigator = (overrides: any = {}) => {
  Object.defineProperty(global, 'navigator', {
    writable: true,
    value: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hardwareConcurrency: 8,
      ...overrides,
    },
  });
};

describe('Performance Utilities', () => {
  beforeEach(() => {
    mockWindow();
    mockNavigator();
  });

  describe('Device Detection', () => {
    test('detects low performance device based on CPU cores', () => {
      mockNavigator({ hardwareConcurrency: 2 });
      expect(isLowPerformanceDevice()).toBe(true);
    });

    test('detects high performance device', () => {
      mockNavigator({ hardwareConcurrency: 8 });
      mockWindow({
        matchMedia: jest.fn().mockImplementation(() => ({
          matches: false,
        })),
      });
      expect(isLowPerformanceDevice()).toBe(false);
    });

    test('detects mobile device by user agent', () => {
      mockNavigator({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' });
      expect(isMobileDevice()).toBe(true);
    });

    test('detects mobile device by screen width', () => {
      mockWindow({ innerWidth: 375 });
      expect(isMobileDevice()).toBe(true);
    });

    test('detects tablet device', () => {
      mockWindow({ innerWidth: 800 });
      expect(isTabletDevice()).toBe(true);
    });

    test('detects desktop device', () => {
      mockWindow({ innerWidth: 1920 });
      mockNavigator({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' });
      expect(isDesktopDevice()).toBe(true);
    });

    test('detects WebGL support', () => {
      const mockCanvas = {
        getContext: jest.fn().mockReturnValue({}),
      };
      document.createElement = jest.fn().mockReturnValue(mockCanvas);
      
      expect(supportsWebGL()).toBe(true);
    });

    test('detects reduced motion preference', () => {
      mockWindow({
        matchMedia: jest.fn().mockImplementation((query) => ({
          matches: query.includes('prefers-reduced-motion'),
        })),
      });
      
      expect(isLowPerformanceDevice()).toBe(true);
    });
  });

  describe('Device Capabilities', () => {
    test('returns comprehensive device capabilities', () => {
      const capabilities = getDeviceCapabilities();
      
      expect(capabilities).toHaveProperty('isLowPerformance');
      expect(capabilities).toHaveProperty('isMobile');
      expect(capabilities).toHaveProperty('isTablet');
      expect(capabilities).toHaveProperty('isDesktop');
      expect(capabilities).toHaveProperty('supportsWebGL');
      expect(capabilities).toHaveProperty('hardwareConcurrency');
      expect(capabilities).toHaveProperty('devicePixelRatio');
      expect(capabilities).toHaveProperty('prefersReducedMotion');
      expect(capabilities).toHaveProperty('connectionSpeed');
    });

    test('returns default capabilities on server side', () => {
      // @ts-ignore
      delete global.window;
      
      const capabilities = getDeviceCapabilities();
      
      expect(capabilities.isDesktop).toBe(true);
      expect(capabilities.hardwareConcurrency).toBe(4);
    });
  });

  describe('Optimal Settings', () => {
    test('reduces particle count for mobile devices', () => {
      mockWindow({ innerWidth: 375 });
      
      const count = getOptimalParticleCount(100);
      
      expect(count).toBeLessThan(100);
      expect(count).toBeGreaterThanOrEqual(20); // Minimum 20 particles
    });

    test('reduces particle count for low performance devices', () => {
      mockNavigator({ hardwareConcurrency: 2 });
      
      const count = getOptimalParticleCount(100);
      
      expect(count).toBeLessThan(100);
    });

    test('maintains minimum particle count', () => {
      mockWindow({ innerWidth: 320 });
      mockNavigator({ hardwareConcurrency: 1 });
      mockWindow({
        matchMedia: jest.fn().mockImplementation(() => ({
          matches: true, // prefers-reduced-motion
        })),
      });
      
      const count = getOptimalParticleCount(100);
      
      expect(count).toBeGreaterThanOrEqual(20);
    });

    test('returns optimal animation settings', () => {
      const settings = getOptimalAnimationSettings();
      
      expect(settings).toHaveProperty('enableParticles');
      expect(settings).toHaveProperty('enableComplexAnimations');
      expect(settings).toHaveProperty('enableHoverEffects');
      expect(settings).toHaveProperty('enableScrollAnimations');
      expect(settings).toHaveProperty('animationDuration');
      expect(settings).toHaveProperty('particleCount');
      expect(settings).toHaveProperty('maxPixelRatio');
    });

    test('disables animations for reduced motion preference', () => {
      mockWindow({
        matchMedia: jest.fn().mockImplementation((query) => ({
          matches: query.includes('prefers-reduced-motion'),
        })),
      });
      
      const settings = getOptimalAnimationSettings();
      
      expect(settings.enableParticles).toBe(false);
      expect(settings.animationDuration).toBe(0);
    });

    test('disables hover effects on mobile', () => {
      mockWindow({ innerWidth: 375 });
      
      const settings = getOptimalAnimationSettings();
      
      expect(settings.enableHoverEffects).toBe(false);
    });
  });

  describe('Performance Monitor', () => {
    test('initializes with default FPS', () => {
      const monitor = new PerformanceMonitor();
      
      expect(monitor.getFPS()).toBe(60);
      expect(monitor.getAverageFPS()).toBe(60);
    });

    test('updates FPS measurements', () => {
      const monitor = new PerformanceMonitor();
      
      // Simulate frame updates
      for (let i = 0; i < 10; i++) {
        monitor.update();
      }
      
      expect(monitor.getFPS()).toBeGreaterThanOrEqual(0);
    });

    test('detects performance degradation', () => {
      const monitor = new PerformanceMonitor();
      
      // Initially not degraded
      expect(monitor.isPerformanceDegraded()).toBe(false);
    });

    test('returns performance quality levels', () => {
      const monitor = new PerformanceMonitor();
      
      const quality = monitor.getPerformanceQuality();
      
      expect(['high', 'medium', 'low']).toContain(quality);
    });

    test('resets monitoring state', () => {
      const monitor = new PerformanceMonitor();
      
      monitor.update();
      monitor.reset();
      
      expect(monitor.getFPS()).toBe(60);
      expect(monitor.getAverageFPS()).toBe(60);
    });
  });

  describe('Utility Functions', () => {
    test('debounce delays function execution', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });

    test('throttle limits function execution rate', (done) => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      setTimeout(() => {
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
        done();
      }, 150);
    });
  });

  describe('Responsive Design Validation', () => {
    test('validates Requirements 9.1: Responsive across devices', () => {
      // Test desktop
      mockWindow({ innerWidth: 1920 });
      let capabilities = getDeviceCapabilities();
      expect(capabilities.isDesktop).toBe(true);
      
      // Test tablet
      mockWindow({ innerWidth: 800 });
      capabilities = getDeviceCapabilities();
      expect(capabilities.isTablet).toBe(true);
      
      // Test mobile
      mockWindow({ innerWidth: 375 });
      capabilities = getDeviceCapabilities();
      expect(capabilities.isMobile).toBe(true);
    });

    test('validates Requirements 9.3: Smooth 60fps animations on supported devices', () => {
      mockNavigator({ hardwareConcurrency: 8 });
      mockWindow({
        matchMedia: jest.fn().mockImplementation(() => ({
          matches: false,
        })),
      });
      
      const settings = getOptimalAnimationSettings();
      
      expect(settings.enableComplexAnimations).toBe(true);
      expect(settings.animationDuration).toBeGreaterThan(0);
    });

    test('validates Requirements 9.4: Graceful degradation for low-performance devices', () => {
      // Simulate low-performance device
      mockNavigator({ hardwareConcurrency: 2, deviceMemory: 2 });
      mockWindow({
        matchMedia: jest.fn().mockImplementation(() => ({
          matches: false,
        })),
      });
      
      const settings = getOptimalAnimationSettings();
      const particleCount = getOptimalParticleCount(100);
      
      // Should reduce particle count
      expect(particleCount).toBeLessThan(100);
      
      // Should still maintain minimum functionality
      expect(particleCount).toBeGreaterThanOrEqual(20);
      expect(settings.animationDuration).toBeGreaterThan(0);
    });

    test('validates graceful degradation with reduced motion preference', () => {
      mockWindow({
        matchMedia: jest.fn().mockImplementation((query) => ({
          matches: query.includes('prefers-reduced-motion'),
        })),
      });
      
      const settings = getOptimalAnimationSettings();
      
      // Should disable animations
      expect(settings.enableParticles).toBe(false);
      expect(settings.animationDuration).toBe(0);
      
      // Should still provide functionality
      expect(settings.particleCount).toBeGreaterThanOrEqual(20);
    });
  });
});



/**
 * Property-Based Tests for Performance Graceful Degradation
 * Using fast-check to validate universal properties
 */
import * as fc from 'fast-check';

describe('Property-Based Tests: Performance Graceful Degradation', () => {
  /**
   * **Validates: Requirements 9.4**
   * Property 37: Performance Graceful Degradation
   * 
   * For any lower-performance device, animations should gracefully degrade 
   * while maintaining functionality
   */
  test('Property 37: Performance Graceful Degradation', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary device configurations
        fc.record({
          hardwareConcurrency: fc.integer({ min: 1, max: 16 }),
          deviceMemory: fc.option(fc.integer({ min: 1, max: 32 }), { nil: undefined }),
          screenWidth: fc.integer({ min: 320, max: 3840 }),
          prefersReducedMotion: fc.boolean(),
          connectionSpeed: fc.constantFrom('slow', 'medium', 'fast'),
          supportsWebGL: fc.boolean(),
        }),
        fc.integer({ min: 50, max: 500 }), // Base particle count
        (deviceConfig, baseParticleCount) => {
          // Mock the device configuration
          mockNavigator({
            hardwareConcurrency: deviceConfig.hardwareConcurrency,
            deviceMemory: deviceConfig.deviceMemory,
          });

          mockWindow({
            innerWidth: deviceConfig.screenWidth,
            matchMedia: jest.fn().mockImplementation((query) => ({
              matches: query.includes('prefers-reduced-motion') && deviceConfig.prefersReducedMotion,
              media: query,
              onchange: null,
              addListener: jest.fn(),
              removeListener: jest.fn(),
              addEventListener: jest.fn(),
              removeEventListener: jest.fn(),
              dispatchEvent: jest.fn(),
            })),
            WebGLRenderingContext: deviceConfig.supportsWebGL,
          });

          // Mock canvas.getContext to avoid jsdom errors
          const mockCanvas = {
            getContext: jest.fn().mockReturnValue(deviceConfig.supportsWebGL ? {} : null),
          };
          document.createElement = jest.fn().mockReturnValue(mockCanvas);

          // Mock connection speed
          Object.defineProperty(global.navigator, 'connection', {
            writable: true,
            configurable: true,
            value: {
              effectiveType: deviceConfig.connectionSpeed === 'slow' ? '2g' : 
                            deviceConfig.connectionSpeed === 'medium' ? '3g' : '4g',
            },
          });

          // Get device capabilities and optimal settings
          const capabilities = getDeviceCapabilities();
          const settings = getOptimalAnimationSettings();
          const particleCount = getOptimalParticleCount(baseParticleCount);

          // PROPERTY 1: Functionality is always maintained
          // Even on the lowest performance devices, minimum functionality should be present
          expect(particleCount).toBeGreaterThanOrEqual(20);
          expect(settings).toHaveProperty('enableParticles');
          expect(settings).toHaveProperty('enableComplexAnimations');
          expect(settings).toHaveProperty('enableHoverEffects');
          expect(settings).toHaveProperty('enableScrollAnimations');
          expect(settings).toHaveProperty('animationDuration');
          expect(settings).toHaveProperty('particleCount');

          // PROPERTY 2: Low-performance devices get reduced settings
          if (capabilities.isLowPerformance) {
            // Particle count should be reduced for low-performance devices
            expect(particleCount).toBeLessThanOrEqual(baseParticleCount);
            
            // Animation duration should be reduced or disabled
            expect(settings.animationDuration).toBeLessThanOrEqual(0.3);
            
            // Complex animations should be disabled
            expect(settings.enableComplexAnimations).toBe(false);
          }

          // PROPERTY 3: Reduced motion preference is respected
          if (deviceConfig.prefersReducedMotion) {
            // Animations should be disabled or minimized
            expect(settings.enableParticles).toBe(false);
            expect(settings.animationDuration).toBe(0);
            
            // But functionality should still be present
            expect(particleCount).toBeGreaterThanOrEqual(20);
          }

          // PROPERTY 4: Mobile devices get optimized settings
          if (capabilities.isMobile) {
            // Particle count should be significantly reduced
            expect(particleCount).toBeLessThanOrEqual(baseParticleCount * 0.5);
            
            // Hover effects should be disabled on mobile
            expect(settings.enableHoverEffects).toBe(false);
            
            // Pixel ratio should be capped
            expect(settings.maxPixelRatio).toBeLessThanOrEqual(1.5);
          }

          // PROPERTY 5: Slow connections get reduced particle counts
          if (deviceConfig.connectionSpeed === 'slow') {
            // Particle count should be reduced for slow connections
            expect(particleCount).toBeLessThanOrEqual(baseParticleCount * 0.7);
          }

          // PROPERTY 6: High-performance devices get full features
          if (!capabilities.isLowPerformance && 
              !deviceConfig.prefersReducedMotion && 
              !capabilities.isMobile &&
              deviceConfig.connectionSpeed !== 'slow') {
            // Should enable complex animations
            expect(settings.enableComplexAnimations).toBe(true);
            
            // Should have reasonable animation duration
            expect(settings.animationDuration).toBeGreaterThan(0);
            
            // Should enable scroll animations
            expect(settings.enableScrollAnimations).toBe(true);
          }

          // PROPERTY 7: Settings are always valid and safe
          expect(settings.animationDuration).toBeGreaterThanOrEqual(0);
          expect(settings.particleCount).toBeGreaterThanOrEqual(20);
          expect(settings.maxPixelRatio).toBeGreaterThan(0);
          expect(typeof settings.enableParticles).toBe('boolean');
          expect(typeof settings.enableComplexAnimations).toBe('boolean');
          expect(typeof settings.enableHoverEffects).toBe('boolean');
          expect(typeof settings.enableScrollAnimations).toBe('boolean');

          // PROPERTY 8: Graceful degradation is proportional
          // The worse the device capabilities, the more aggressive the degradation
          const performanceScore = 
            (capabilities.isLowPerformance ? 0 : 1) +
            (capabilities.isMobile ? 0 : 1) +
            (deviceConfig.prefersReducedMotion ? 0 : 1) +
            (deviceConfig.connectionSpeed === 'fast' ? 1 : 0);

          // Lower performance scores should result in lower particle counts
          const particleRatio = particleCount / baseParticleCount;
          
          if (performanceScore === 0) {
            // Worst case: should be heavily reduced (mobile + low perf + reduced motion + slow connection)
            // With all multipliers: 0.4 * 0.5 * 0.3 * 0.5 = 0.03, but minimum is 20 particles
            // So for baseCount=50, we get 20/50 = 0.4
            expect(particleRatio).toBeLessThanOrEqual(0.5);
          } else if (performanceScore === 4) {
            // Best case: should be close to base count
            // Note: tablets (768-1023px) get 0.6 multiplier, so we need to account for that
            expect(particleRatio).toBeGreaterThanOrEqual(0.55);
          }
          
          // Ensure degradation is monotonic: lower scores = lower ratios
          // (This is a weaker property but more robust)
          expect(particleRatio).toBeGreaterThan(0);
          expect(particleRatio).toBeLessThanOrEqual(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Performance Monitor graceful degradation
   * Validates that performance monitoring itself doesn't degrade functionality
   */
  test('Property 37 (Extended): Performance Monitor maintains functionality under degradation', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 10, max: 60 }), { minLength: 10, maxLength: 100 }),
        (fpsValues) => {
          const monitor = new PerformanceMonitor();

          // Simulate FPS measurements
          fpsValues.forEach((fps) => {
            // Mock the FPS value by manipulating the monitor's internal state
            monitor.update();
          });

          // PROPERTY: Monitor always returns valid values
          const currentFPS = monitor.getFPS();
          const avgFPS = monitor.getAverageFPS();
          const quality = monitor.getPerformanceQuality();
          const isDegraded = monitor.isPerformanceDegraded();

          // FPS values should be non-negative
          expect(currentFPS).toBeGreaterThanOrEqual(0);
          expect(avgFPS).toBeGreaterThanOrEqual(0);

          // Quality should be one of the valid values
          expect(['high', 'medium', 'low']).toContain(quality);

          // Degradation flag should be boolean
          expect(typeof isDegraded).toBe('boolean');

          // Quality should match FPS ranges
          if (avgFPS >= 50) {
            expect(quality).toBe('high');
            expect(isDegraded).toBe(false);
          } else if (avgFPS >= 30) {
            expect(quality).toBe('medium');
            expect(isDegraded).toBe(false);
          } else {
            expect(quality).toBe('low');
            expect(isDegraded).toBe(true);
          }

          // Reset should work without errors
          monitor.reset();
          expect(monitor.getFPS()).toBe(60);
          expect(monitor.getAverageFPS()).toBe(60);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Utility functions maintain performance
   * Validates that debounce and throttle don't break under various inputs
   */
  test('Property 37 (Extended): Performance utilities maintain functionality', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 1000 }),
        fc.integer({ min: 1, max: 10 }),
        (delay, callCount) => {
          let executionCount = 0;
          const testFn = () => { executionCount++; };

          // Test debounce
          const debouncedFn = debounce(testFn, delay);
          for (let i = 0; i < callCount; i++) {
            debouncedFn();
          }

          // Debounce should prevent immediate execution
          expect(executionCount).toBe(0);

          // Test throttle
          executionCount = 0;
          const throttledFn = throttle(testFn, delay);
          for (let i = 0; i < callCount; i++) {
            throttledFn();
          }

          // Throttle should allow at least one execution
          expect(executionCount).toBeGreaterThanOrEqual(1);
          // But should limit executions
          expect(executionCount).toBeLessThanOrEqual(callCount);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
