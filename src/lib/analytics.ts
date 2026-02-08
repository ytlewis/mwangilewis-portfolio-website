/**
 * Performance Analytics and Monitoring
 * Tracks page load times, Core Web Vitals, and user interactions
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  
  // Additional metrics
  domContentLoaded?: number;
  loadComplete?: number;
  resourceLoadTime?: number;
  
  // Page info
  url: string;
  timestamp: number;
  userAgent: string;
  connectionType?: string;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

/**
 * Performance Analytics Manager
 */
export class PerformanceAnalytics {
  private metrics: PerformanceMetrics[] = [];
  private events: AnalyticsEvent[] = [];
  private readonly maxStoredMetrics = 50;
  private readonly maxStoredEvents = 100;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePerformanceObservers();
      this.trackPageLoad();
    }
  }

  /**
   * Initialize Performance Observers for Core Web Vitals
   */
  private initializePerformanceObservers(): void {
    // Observe Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Observe Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.recordMetric('CLS', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }

  /**
   * Track page load performance
   */
  private trackPageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      // Use setTimeout to ensure all metrics are available
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
          const metrics: PerformanceMetrics = {
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            TTFB: perfData.responseStart - perfData.requestStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            resourceLoadTime: perfData.loadEventEnd - perfData.fetchStart,
          };

          // Get FCP if available
          const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
          if (fcpEntry) {
            metrics.FCP = fcpEntry.startTime;
          }

          // Get connection type if available
          const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
          if (connection) {
            metrics.connectionType = connection.effectiveType;
          }

          this.storeMetrics(metrics);
          this.checkPerformanceThresholds(metrics);
        }
      }, 0);
    });
  }

  /**
   * Record a specific metric
   */
  private recordMetric(name: keyof PerformanceMetrics, value: number): void {
    const existingMetrics = this.metrics[this.metrics.length - 1];
    if (existingMetrics) {
      (existingMetrics as any)[name] = value;
    }
  }

  /**
   * Store performance metrics
   */
  private storeMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics.shift();
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('performance_metrics', JSON.stringify(this.metrics.slice(-10)));
    } catch (error) {
      console.warn('Failed to store metrics in localStorage:', error);
    }
  }

  /**
   * Check if performance meets thresholds and log warnings
   */
  private checkPerformanceThresholds(metrics: PerformanceMetrics): void {
    const thresholds = {
      LCP: 2500, // Good: < 2.5s
      FID: 100,  // Good: < 100ms
      CLS: 0.1,  // Good: < 0.1
      TTFB: 800, // Good: < 800ms
      loadComplete: 3000, // Target: < 3s
    };

    const warnings: string[] = [];

    if (metrics.LCP && metrics.LCP > thresholds.LCP) {
      warnings.push(`LCP (${Math.round(metrics.LCP)}ms) exceeds threshold (${thresholds.LCP}ms)`);
    }

    if (metrics.FID && metrics.FID > thresholds.FID) {
      warnings.push(`FID (${Math.round(metrics.FID)}ms) exceeds threshold (${thresholds.FID}ms)`);
    }

    if (metrics.CLS && metrics.CLS > thresholds.CLS) {
      warnings.push(`CLS (${metrics.CLS.toFixed(3)}) exceeds threshold (${thresholds.CLS})`);
    }

    if (metrics.TTFB && metrics.TTFB > thresholds.TTFB) {
      warnings.push(`TTFB (${Math.round(metrics.TTFB)}ms) exceeds threshold (${thresholds.TTFB}ms)`);
    }

    if (metrics.loadComplete && metrics.loadComplete > thresholds.loadComplete) {
      warnings.push(`Load time (${Math.round(metrics.loadComplete)}ms) exceeds 3-second target`);
    }

    if (warnings.length > 0) {
      console.warn('Performance warnings:', warnings);
    } else {
      console.log('✓ All performance metrics within acceptable thresholds');
    }
  }

  /**
   * Track custom analytics event
   */
  trackEvent(category: string, action: string, label?: string, value?: number): void {
    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Keep only the most recent events
    if (this.events.length > this.maxStoredEvents) {
      this.events.shift();
    }

    // Log event for debugging
    console.log('Analytics Event:', event);
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get latest performance metrics
   */
  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  /**
   * Get average metrics across all stored data
   */
  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {};

    const sum: any = {};
    const count: any = {};

    this.metrics.forEach((metric) => {
      Object.entries(metric).forEach(([key, value]) => {
        if (typeof value === 'number') {
          sum[key] = (sum[key] || 0) + value;
          count[key] = (count[key] || 0) + 1;
        }
      });
    });

    const averages: any = {};
    Object.keys(sum).forEach((key) => {
      averages[key] = sum[key] / count[key];
    });

    return averages;
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Check if page load meets 3-second target
   */
  meetsLoadTimeTarget(): boolean {
    const latest = this.getLatestMetrics();
    if (!latest || !latest.loadComplete) return false;
    return latest.loadComplete <= 3000;
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    const latest = this.getLatestMetrics();
    if (!latest) return 0;

    let score = 100;

    // Deduct points for poor metrics
    if (latest.LCP) {
      if (latest.LCP > 4000) score -= 30;
      else if (latest.LCP > 2500) score -= 15;
    }

    if (latest.FID) {
      if (latest.FID > 300) score -= 20;
      else if (latest.FID > 100) score -= 10;
    }

    if (latest.CLS) {
      if (latest.CLS > 0.25) score -= 20;
      else if (latest.CLS > 0.1) score -= 10;
    }

    if (latest.TTFB) {
      if (latest.TTFB > 1800) score -= 15;
      else if (latest.TTFB > 800) score -= 7;
    }

    if (latest.loadComplete) {
      if (latest.loadComplete > 5000) score -= 15;
      else if (latest.loadComplete > 3000) score -= 7;
    }

    return Math.max(0, score);
  }

  /**
   * Export metrics for external analytics
   */
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      events: this.events,
      averages: this.getAverageMetrics(),
      score: this.getPerformanceScore(),
      timestamp: Date.now(),
    }, null, 2);
  }

  /**
   * Clear all stored metrics and events
   */
  clear(): void {
    this.metrics = [];
    this.events = [];
    try {
      localStorage.removeItem('performance_metrics');
    } catch (error) {
      console.warn('Failed to clear metrics from localStorage:', error);
    }
  }
}

// Create singleton instance
let analyticsInstance: PerformanceAnalytics | null = null;

/**
 * Get or create analytics instance
 */
export const getAnalytics = (): PerformanceAnalytics => {
  if (typeof window === 'undefined') {
    // Return a mock instance for SSR
    return {
      trackEvent: () => {},
      getMetrics: () => [],
      getLatestMetrics: () => null,
      getAverageMetrics: () => ({}),
      getEvents: () => [],
      meetsLoadTimeTarget: () => false,
      getPerformanceScore: () => 0,
      exportMetrics: () => '{}',
      clear: () => {},
    } as any;
  }

  if (!analyticsInstance) {
    analyticsInstance = new PerformanceAnalytics();
  }

  return analyticsInstance;
};

/**
 * Track page view
 */
export const trackPageView = (pageName: string): void => {
  const analytics = getAnalytics();
  analytics.trackEvent('Navigation', 'Page View', pageName);
};

/**
 * Track user interaction
 */
export const trackInteraction = (element: string, action: string): void => {
  const analytics = getAnalytics();
  analytics.trackEvent('Interaction', action, element);
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formName: string, success: boolean): void => {
  const analytics = getAnalytics();
  analytics.trackEvent('Form', success ? 'Submit Success' : 'Submit Error', formName);
};

/**
 * Track error
 */
export const trackError = (errorType: string, errorMessage: string): void => {
  const analytics = getAnalytics();
  analytics.trackEvent('Error', errorType, errorMessage);
};
