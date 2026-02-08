import { useEffect, useRef, RefObject } from 'react';
import {
  createImageHoverAnimation,
  createButtonAnimation,
  createFadeInAnimation,
  createStaggerAnimation,
  createTextRevealAnimation,
  initSmoothScrolling,
  cleanupAnimations,
} from '@/lib/animations';

// Hook for image hover animations
export const useImageHover = <T extends HTMLElement>(): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      const animation = createImageHoverAnimation(ref.current);
      return () => {
        animation?.kill();
      };
    }
  }, []);

  return ref;
};

// Hook for button animations
export const useButtonAnimation = <T extends HTMLElement>(): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      const animations = createButtonAnimation(ref.current);
      return () => {
        animations?.clickAnimation.kill();
        animations?.hoverAnimation.kill();
        animations?.focusAnimation.kill();
      };
    }
  }, []);

  return ref;
};

// Hook for fade in animations
export const useFadeIn = <T extends HTMLElement>(delay: number = 0): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      createFadeInAnimation(ref.current, delay);
    }
  }, [delay]);

  return ref;
};

// Hook for stagger animations
export const useStaggerAnimation = <T extends HTMLElement>(): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      const children = ref.current.children;
      if (children.length > 0) {
        createStaggerAnimation(Array.from(children) as Element[]);
      }
    }
  }, []);

  return ref;
};

// Hook for text reveal animations
export const useTextReveal = <T extends HTMLElement>(): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (ref.current) {
      createTextRevealAnimation(ref.current);
    }
  }, []);

  return ref;
};

// Hook for smooth scrolling initialization
export const useSmoothScrolling = () => {
  useEffect(() => {
    // Temporarily disabled to debug webpack issues
    // initSmoothScrolling();
    
    return () => {
      // cleanupAnimations();
    };
  }, []);
};