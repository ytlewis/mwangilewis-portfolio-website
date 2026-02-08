/**
 * Performance Optimization Utilities
 * Provides utilities for optimizing page load performance
 */

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  fontLink.href = '/fonts/inter-var.woff2';
  document.head.appendChild(fontLink);
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImages = () => {
  if (typeof window === 'undefined') return;
  if (!('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img.lazy').forEach((img) => {
    imageObserver.observe(img);
  });
};

/**
 * Defer non-critical scripts
 */
export const deferNonCriticalScripts = () => {
  if (typeof window === 'undefined') return;

  // Defer analytics and tracking scripts
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    newScript.src = script.getAttribute('src') || '';
    newScript.defer = true;
    document.body.appendChild(newScript);
  });
};

/**
 * Optimize CSS delivery
 */
export const optimizeCSSDelivery = () => {
  if (typeof window === 'undefined') return;

  // Load non-critical CSS asynchronously
  const loadCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  };

  // Example: Load animation CSS after page load
  if (document.readyState === 'complete') {
    loadCSS('/styles/animations.css');
  } else {
    window.addEventListener('load', () => {
      loadCSS('/styles/animations.css');
    });
  }
};

/**
 * Prefetch next page resources
 */
export const prefetchNextPage = (url: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Enable service worker for caching
 */
export const enableServiceWorker = async () => {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

/**
 * Optimize third-party scripts
 */
export const optimizeThirdPartyScripts = () => {
  if (typeof window === 'undefined') return;

  // Delay loading of third-party scripts until user interaction
  let loaded = false;

  const loadThirdPartyScripts = () => {
    if (loaded) return;
    loaded = true;

    // Load analytics
    const analyticsScript = document.createElement('script');
    analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    analyticsScript.async = true;
    document.head.appendChild(analyticsScript);

    // Initialize analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  };

  // Load on first user interaction
  const events = ['scroll', 'mousemove', 'touchstart', 'click'];
  events.forEach((event) => {
    window.addEventListener(event, loadThirdPartyScripts, { once: true, passive: true });
  });

  // Fallback: load after 5 seconds
  setTimeout(loadThirdPartyScripts, 5000);
};

/**
 * Compress and optimize images
 */
export const optimizeImages = () => {
  if (typeof window === 'undefined') return;

  // Use modern image formats when supported
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  const supportsAVIF = () => {
    const avif = new Image();
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    return avif.complete && avif.width > 0;
  };

  // Store support info
  (window as any).__imageFormats = {
    webp: supportsWebP(),
    avif: supportsAVIF(),
  };
};

/**
 * Reduce JavaScript bundle size
 */
export const optimizeJavaScript = () => {
  // This is handled by Next.js build process
  // But we can provide hints for code splitting
  
  // Dynamic imports for heavy components
  // Example: const HeavyComponent = dynamic(() => import('./HeavyComponent'), { ssr: false });
};

/**
 * Monitor and report performance metrics
 */
export const monitorPerformance = () => {
  if (typeof window === 'undefined') return;

  // Report Core Web Vitals
  const reportWebVitals = (metric: any) => {
    console.log('Web Vital:', metric);
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  };

  // Use web-vitals library if available
  // Temporarily disabled due to webpack module loading issues
  // Will be re-enabled after fixing the module resolution
  /*
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      // Try to import web-vitals with better error handling
      import('web-vitals')
        .then((webVitals) => {
          if (webVitals && webVitals.getCLS && webVitals.getFID && webVitals.getFCP && webVitals.getLCP && webVitals.getTTFB) {
            webVitals.getCLS(reportWebVitals);
            webVitals.getFID(reportWebVitals);
            webVitals.getFCP(reportWebVitals);
            webVitals.getLCP(reportWebVitals);
            webVitals.getTTFB(reportWebVitals);
          }
        })
        .catch((error) => {
          // web-vitals not available, use fallback
          console.log('web-vitals library not available:', error);
        });
    } catch (error) {
      console.log('Error loading web-vitals:', error);
    }
  }
  */
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  if (typeof window === 'undefined') return;

  // Run optimizations after page load
  if (document.readyState === 'complete') {
    runOptimizations();
  } else {
    window.addEventListener('load', runOptimizations);
  }
};

const runOptimizations = () => {
  preloadCriticalResources();
  lazyLoadImages();
  optimizeImages();
  optimizeThirdPartyScripts();
  monitorPerformance();
  
  // Prefetch common next pages
  prefetchNextPage('/about');
  prefetchNextPage('/projects');
  prefetchNextPage('/contact');
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __imageFormats?: {
      webp: boolean;
      avif: boolean;
    };
  }
}

export default {
  preloadCriticalResources,
  lazyLoadImages,
  deferNonCriticalScripts,
  optimizeCSSDelivery,
  prefetchNextPage,
  enableServiceWorker,
  optimizeThirdPartyScripts,
  optimizeImages,
  optimizeJavaScript,
  monitorPerformance,
  initializePerformanceOptimizations,
};
