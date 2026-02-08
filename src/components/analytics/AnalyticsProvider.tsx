/**
 * Analytics Provider Component
 * Initializes performance analytics and tracks page views
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAnalytics, trackPageView } from '@/lib/analytics';

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Initialize analytics
    getAnalytics();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Track page view on route change
    if (pathname) {
      const pageName = pathname === '/' ? 'Home' : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);
      trackPageView(pageName);
    }
  }, [pathname, mounted]);

  // Always render children to prevent hydration mismatch
  return <>{children}</>;
};

export default AnalyticsProvider;
