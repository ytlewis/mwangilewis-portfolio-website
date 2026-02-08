/**
 * Performance Utilities
 * Detects device capabilities and provides performance optimization helpers
 */

export interface DeviceCapabilities {
  isLowPerformance: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebGL: boolean;
  hardwareConcurrency: number;
  devicePixelRatio: number;
  prefersReducedMotion: boolean;
  connectionSpeed: 'slow' | 'medium' | 'fast';
}

/**
 * Detect if the device is low performance
 */
export const isLowPerformanceDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  if (cores < 4) return true;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;

  // Check if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  return false;
};

/**
 * Detect if the device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

/**
 * Detect if the device is a tablet
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  return width >= 768 && width < 1024;
};

/**
 * Detect if the device is desktop
 */
export const isDesktopDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth >= 1024 && !isMobileDevice();
};

/**
 * Check if WebGL is supported
 */
export const supportsWebGL = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

/**
 * Detect connection speed
 */
export const getConnectionSpeed = (): 'slow' | 'medium' | 'fast' => {
  if (typeof window === 'undefined') return 'medium';

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return 'medium';

  const effectiveType = connection.effectiveType;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (effectiveType === '3g') return 'medium';
  return 'fast';
};

/**
 * Get comprehensive device capabilities
 */
export const getDeviceCapabilities = (): DeviceCapabilities => {
  if (typeof window === 'undefined') {
    return {
      isLowPerformance: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      supportsWebGL: false,
      hardwareConcurrency: 4,
      devicePixelRatio: 1,
      prefersReducedMotion: false,
      connectionSpeed: 'medium',
    };
  }

  return {
    isLowPerformance: isLowPerformanceDevice(),
    isMobile: isMobileDevice(),
    isTablet: isTabletDevice(),
    isDesktop: isDesktopDevice(),
    supportsWebGL: supportsWebGL(),
    hardwareConcurrency: navigator.hardwareConcurrency || 2,
    devicePixelRatio: window.devicePixelRatio || 1,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    connectionSpeed: getConnectionSpeed(),
  };
};

/**
 * Get optimal particle count based on device capabilities
 */
export const getOptimalParticleCount = (baseCount: number): number => {
  const capabilities = getDeviceCapabilities();
  
  let multiplier = 1;
  
  // Reduce for mobile devices
  if (capabilities.isMobile) multiplier *= 0.4;
  else if (capabilities.isTablet) multiplier *= 0.6;
  
  // Reduce for low performance devices
  if (capabilities.isLowPerformance) multiplier *= 0.5;
  
  // Reduce if user prefers reduced motion
  if (capabilities.prefersReducedMotion) multiplier *= 0.3;
  
  // Reduce for slow connections
  if (capabilities.connectionSpeed === 'slow') multiplier *= 0.5;
  
  return Math.max(Math.floor(baseCount * multiplier), 20); // Minimum 20 particles
};

/**
 * Get optimal animation settings based on device capabilities
 */
export const getOptimalAnimationSettings = () => {
  const capabilities = getDeviceCapabilities();
  
  return {
    enableParticles: !capabilities.prefersReducedMotion && capabilities.supportsWebGL,
    enableComplexAnimations: !capabilities.isLowPerformance && !capabilities.prefersReducedMotion,
    enableHoverEffects: !capabilities.isMobile && !capabilities.prefersReducedMotion,
    enableScrollAnimations: !capabilities.prefersReducedMotion,
    animationDuration: capabilities.prefersReducedMotion ? 0 : capabilities.isLowPerformance ? 0.2 : 0.3,
    particleCount: getOptimalParticleCount(100),
    maxPixelRatio: capabilities.isMobile ? 1.5 : 2,
  };
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private fpsHistory: number[] = [];
  private readonly maxHistoryLength = 60; // Track last 60 FPS measurements

  constructor() {
    if (typeof window !== 'undefined') {
      this.lastTime = performance.now();
    }
  }

  /**
   * Update FPS calculation
   */
  update(): void {
    if (typeof window === 'undefined') return;

    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.fpsHistory.push(this.fps);
      
      // Keep history limited
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.frameCount++;
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Get average FPS over history
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  /**
   * Check if performance is degraded
   */
  isPerformanceDegraded(): boolean {
    const avgFPS = this.getAverageFPS();
    return avgFPS < 30; // Consider performance degraded if below 30 FPS
  }

  /**
   * Get performance quality level
   */
  getPerformanceQuality(): 'high' | 'medium' | 'low' {
    const avgFPS = this.getAverageFPS();
    
    if (avgFPS >= 50) return 'high';
    if (avgFPS >= 30) return 'medium';
    return 'low';
  }

  /**
   * Reset monitoring
   */
  reset(): void {
    this.frameCount = 0;
    this.fps = 60;
    this.fpsHistory = [];
    if (typeof window !== 'undefined') {
      this.lastTime = performance.now();
    }
  }
}

/**
 * Debounce utility for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle utility for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (callback: IdleRequestCallback) => setTimeout(callback, 1);

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);
