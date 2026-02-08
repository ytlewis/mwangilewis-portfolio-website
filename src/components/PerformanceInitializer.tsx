/**
 * Performance Initializer Component
 * Initializes performance monitoring and optimizations on the client side
 */

'use client';

import { useEffect } from 'react';
import { getAnalytics } from '@/lib/analytics';
import { initializePerformanceOptimizations } from '@/lib/performanceOptimization';

export function PerformanceInitializer() {
  useEffect(() => {
    // Initialize analytics
    const analytics = getAnalytics();
    
    // Initialize performance optimizations
    initializePerformanceOptimizations();

    // Log initialization
    console.log('✓ Performance monitoring initialized');
    
    // Check if 3-second target is met after page load
    const checkPerformance = () => {
      const latest = analytics.getLatestMetrics();
      if (latest) {
        const meetsTarget = analytics.meetsLoadTimeTarget();
        const score = analytics.getPerformanceScore();
        
        console.log(`Performance Score: ${score}/100`);
        console.log(`3-Second Target: ${meetsTarget ? '✓ Met' : '✗ Not Met'}`);
        
        if (latest.loadComplete) {
          console.log(`Load Time: ${Math.round(latest.loadComplete)}ms`);
        }
      }
    };

    // Check performance after a short delay to ensure metrics are collected
    setTimeout(checkPerformance, 2000);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // This component doesn't render anything
  return null;
}

export default PerformanceInitializer;
