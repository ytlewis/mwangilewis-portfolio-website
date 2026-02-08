/**
 * Property-Based Tests for Animation Performance Maintenance
 * Tests Property 36: Animation Performance Maintenance
 * Validates: Requirements 9.3
 */

import * as fc from 'fast-check';
import {
  PerformanceMonitor,
  getDeviceCapabilities,
  getOptimalAnimationSettings,
} from '../performance';
import test, { beforeEach, describe } from 'node:test';

// Import jest functions
const { fn } = jest;

// Mock window and navigator for testing
const mockWindow = (props: any) => {
  const mockPerformance = props.performance || {
    now: fn(() => Date.now()),
  };

  Object.defineProperty(global, 'window', {
    writable: true,
    configurable: true,
    value: {
      ...global.window,
      ...props,
      performance: mockPerformance,
      matchMedia: fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion') ? false : false,
        media: query,
        onchange: null,
        addListener: fn(),
        removeListener: fn(),
        addEventListener: fn(),
        removeEventListener: fn(),
        dispatchEvent: fn(),
      })),
    },
  });
};

const mockNavigator = (props: any) => {
  Object.defineProperty(global, 'navigator', {
    writable: true,
    configurable: true,
    value: {
      ...global.navigator,
      userAgent: 'Mozilla/5.0',
      hardwareConcurrency: 4,
      ...props,
    },
  });
};

describe('Property 36: Animation Performance Maintenance', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockNavigator({ hardwareConcurrency: 8 });
    mockWindow({});
  });

  test('Property 36: Animation Performance Maintenance - **Validates: Requirements 9.3**', () => {
    /**
     * **Property 36: Animation Performance Maintenance**
     * **Validates: Requirements 9.3**
     * 
     * For any supported device, animations should maintain smooth 60fps performance
     * 
     * This property verifies that:
     * 1. Supported devices (high-performance) have animations enabled
     * 2. Performance monitor can track FPS measurements
     * 3. Animation settings are optimized for smooth performance
     * 4. Complex animations are enabled on supported devices
     */

    // Generator for device configurations representing supported devices
    const supportedDeviceArb = fc.record({
      hardwareConcurrency: fc.integer({ min: 4, max: 16 }), // 4+ cores = supported
      deviceMemory: fc.integer({ min: 4, max: 32 }), // 4GB+ RAM = supported
      prefersReducedMotion: fc.constant(false), // Supported devices don't prefer reduced motion
      innerWidth: fc.integer({ min: 1024, max: 3840 }), // Desktop/laptop widths
      devicePixelRatio: fc.double({ min: 1, max: 3 }),
      userAgent: fc.constantFrom(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      ),
    });

    fc.assert(
      fc.property(supportedDeviceArb, (device) => {
        // Mock the device environment
        mockNavigator({
          hardwareConcurrency: device.hardwareConcurrency,
          userAgent: device.userAgent,
        });

        mockWindow({
          innerWidth: device.innerWidth,
          devicePixelRatio: device.devicePixelRatio,
          performance: {
            now: jest.fn(() => Date.now()),
          },
        });

        // Get device capabilities
        const capabilities = getDeviceCapabilities();

        // Verify this is a supported device (not low performance)
        expect(capabilities.isLowPerformance).toBe(false);
        expect(capabilities.prefersReducedMotion).toBe(false);

        // Get optimal animation settings for this supported device
        const settings = getOptimalAnimationSettings();

        // Property: Supported devices should have animations enabled
        expect(settings.enableComplexAnimations).toBe(true);
        expect(settings.enableScrollAnimations).toBe(true);

        // Property: Animation duration should be optimized (not 0, not too slow)
        expect(settings.animationDuration).toBeGreaterThan(0);
        expect(settings.animationDuration).toBeLessThanOrEqual(0.5);

        // Property: Particle count should be reasonable for performance
        expect(settings.particleCount).toBeGreaterThan(0);
        expect(settings.particleCount).toBeLessThanOrEqual(100);

        // Test PerformanceMonitor can track FPS
        const monitor = new PerformanceMonitor();

        // Simulate animation frames at 60fps
        const frameTime = 1000 / 60; // ~16.67ms per frame
        let currentTime = 0;

        // Mock performance.now to simulate 60fps
        const mockNow = fn(() => currentTime);
        if (typeof window !== 'undefined') {
          window.performance.now = mockNow;
        }

        // Simulate 60 frames (1 second at 60fps)
        for (let i = 0; i < 60; i++) {
          currentTime += frameTime;
          monitor.update();
        }

        // After 1 second, advance time to trigger FPS calculation
        currentTime += 1000;
        monitor.update();

        // Property: Performance monitor should track FPS close to 60
        const fps = monitor.getFPS();
        expect(fps).toBeGreaterThanOrEqual(55); // Allow small variance
        expect(fps).toBeLessThanOrEqual(65);

        // Property: Average FPS should indicate smooth performance
        const avgFPS = monitor.getAverageFPS();
        expect(avgFPS).toBeGreaterThanOrEqual(50); // Smooth = 50+ fps

        // Property: Performance should not be degraded on supported devices
        expect(monitor.isPerformanceDegraded()).toBe(false);

        // Property: Performance quality should be high on supported devices
        const quality = monitor.getPerformanceQuality();
        expect(quality).toBe('high');
      }),
      { numRuns: 100 }
    );
  });

  test('Performance monitor correctly tracks varying FPS', () => {
    /**
     * Unit test to verify PerformanceMonitor accurately tracks FPS changes
     */
    mockWindow({
      performance: {
        now: fn(() => Date.now()),
      },
    });

    const monitor = new PerformanceMonitor();
    let currentTime = 0;

    const mockNow = fn(() => currentTime);
    if (typeof window !== 'undefined') {
      window.performance.now = mockNow;
    }

    // Simulate 30fps (slower performance)
    const frameTime30 = 1000 / 30; // ~33.33ms per frame
    for (let i = 0; i < 30; i++) {
      currentTime += frameTime30;
      monitor.update();
    }

    currentTime += 1000;
    monitor.update();

    const fps30 = monitor.getFPS();
    expect(fps30).toBeGreaterThanOrEqual(25);
    expect(fps30).toBeLessThanOrEqual(35);

    // Reset and simulate 60fps
    monitor.reset();
    currentTime = 0;

    const frameTime60 = 1000 / 60;
    for (let i = 0; i < 60; i++) {
      currentTime += frameTime60;
      monitor.update();
    }

    currentTime += 1000;
    monitor.update();

    const fps60 = monitor.getFPS();
    expect(fps60).toBeGreaterThanOrEqual(55);
    expect(fps60).toBeLessThanOrEqual(65);
  });

  test('Animation settings adapt to device capabilities', () => {
    /**
     * Unit test to verify animation settings are properly optimized
     * for different device types
     */

    // Test high-performance desktop
    mockNavigator({ hardwareConcurrency: 8 });
    mockWindow({ innerWidth: 1920 });

    let settings = getOptimalAnimationSettings();
    expect(settings.enableComplexAnimations).toBe(true);
    expect(settings.particleCount).toBeGreaterThan(50);

    // Test mobile device
    mockNavigator({ hardwareConcurrency: 4 });
    mockWindow({
      innerWidth: 375,
      matchMedia: fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: fn(),
        removeListener: fn(),
        addEventListener: fn(),
        removeEventListener: fn(),
        dispatchEvent: fn(),
      })),
    });

    // Update navigator to simulate mobile
    Object.defineProperty(global.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    });

    settings = getOptimalAnimationSettings();
    // Mobile devices should have reduced particle count
    expect(settings.particleCount).toBeLessThan(100);
  });

  test('Performance monitor detects degraded performance', () => {
    /**
     * Unit test to verify performance degradation detection
     */
    mockWindow({
      performance: {
        now: fn(() => Date.now()),
      },
    });

    const monitor = new PerformanceMonitor();
    let currentTime = 0;

    const mockNow = fn(() => currentTime);
    if (typeof window !== 'undefined') {
      window.performance.now = mockNow;
    }

    // Simulate very low FPS (20fps)
    const frameTime20 = 1000 / 20;
    for (let i = 0; i < 20; i++) {
      currentTime += frameTime20;
      monitor.update();
    }

    currentTime += 1000;
    monitor.update();

    // Should detect degraded performance
    expect(monitor.isPerformanceDegraded()).toBe(true);
    expect(monitor.getPerformanceQuality()).toBe('low');
  });
});
function expect(isLowPerformance: boolean) {
  throw new Error('Function not implemented.');
}

