import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { getOptimalAnimationSettings } from './performance';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Get optimal animation settings
const animationSettings = typeof window !== 'undefined' ? getOptimalAnimationSettings() : {
  enableParticles: true,
  enableComplexAnimations: true,
  enableHoverEffects: true,
  enableScrollAnimations: true,
  animationDuration: 0.3,
  particleCount: 100,
  maxPixelRatio: 2,
};

// Animation configuration
export const animationConfig = {
  duration: animationSettings.animationDuration,
  ease: 'power2.out',
  stagger: 0.1,
  scrollDuration: 1.5,
  hoverScale: animationSettings.enableHoverEffects ? 1.05 : 1,
  hoverGlow: animationSettings.enableHoverEffects ? '0 0 20px rgba(230, 57, 70, 0.3)' : 'none',
  hoverTilt: animationSettings.enableHoverEffects ? 5 : 0,
};

// Smooth scrolling utility
export const initSmoothScrolling = () => {
  if (typeof window === 'undefined') return;

  // Enable smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href) return;
      
      const target = document.querySelector(href);
      
      if (target) {
        try {
          // Try to use GSAP ScrollToPlugin if available
          if (ScrollToPlugin) {
            gsap.to(window, {
              duration: animationConfig.scrollDuration,
              scrollTo: { y: target, offsetY: 80 },
              ease: 'power2.inOut'
            });
          } else {
            // Fallback to native smooth scroll
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (error) {
          // Fallback to native smooth scroll on error
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Add smooth scrolling to window scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
};

// Image hover animations with performance checks
export const createImageHoverAnimation = (element: HTMLElement) => {
  if (!element || !animationSettings.enableHoverEffects) return;

  const tl = gsap.timeline({ paused: true });
  
  tl.to(element, {
    scale: animationConfig.hoverScale,
    rotationY: animationConfig.hoverTilt,
    rotationX: animationConfig.hoverTilt * 0.5,
    boxShadow: animationConfig.hoverGlow,
    duration: animationConfig.duration,
    ease: animationConfig.ease,
    transformPerspective: 1000,
    transformOrigin: 'center center',
  });

  element.addEventListener('mouseenter', () => tl.play());
  element.addEventListener('mouseleave', () => tl.reverse());

  return tl;
};

// Button micro-interactions with performance checks
export const createButtonAnimation = (element: HTMLElement) => {
  if (!element) return;

  // Click animation
  const clickTl = gsap.timeline({ paused: true });
  
  clickTl.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.out',
  })
  .to(element, {
    scale: 1.02,
    duration: 0.15,
    ease: 'back.out(1.7)',
  })
  .to(element, {
    scale: 1,
    duration: 0.1,
    ease: 'power2.out',
  });

  // Hover effect (only on devices that support hover)
  const hoverTl = gsap.timeline({ paused: true });
  if (animationSettings.enableHoverEffects) {
    hoverTl.to(element, {
      scale: 1.05,
      boxShadow: '0 4px 15px rgba(230, 57, 70, 0.2)',
      y: -2,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
    });
  }

  // Focus effect
  const focusTl = gsap.timeline({ paused: true });
  focusTl.to(element, {
    boxShadow: '0 0 0 3px rgba(230, 57, 70, 0.3)',
    duration: 0.2,
    ease: 'power2.out',
  });

  // Event listeners
  element.addEventListener('click', () => {
    clickTl.restart();
  });

  if (animationSettings.enableHoverEffects) {
    element.addEventListener('mouseenter', () => hoverTl.play());
    element.addEventListener('mouseleave', () => hoverTl.reverse());
  }
  
  element.addEventListener('focus', () => focusTl.play());
  element.addEventListener('blur', () => focusTl.reverse());

  // Touch feedback for mobile
  element.addEventListener('touchstart', () => {
    gsap.to(element, { scale: 0.98, duration: 0.1 });
  });
  
  element.addEventListener('touchend', () => {
    gsap.to(element, { scale: 1, duration: 0.1 });
  });

  return { clickAnimation: clickTl, hoverAnimation: hoverTl, focusAnimation: focusTl };
};

// Fade in animation for sections with performance checks
export const createFadeInAnimation = (element: HTMLElement, delay: number = 0) => {
  if (!element || !animationSettings.enableScrollAnimations) return;

  gsap.fromTo(element, 
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    }
  );
};

// Stagger animation for lists with performance checks
export const createStaggerAnimation = (elements: NodeListOf<Element> | Element[]) => {
  if (!elements || elements.length === 0 || !animationSettings.enableScrollAnimations) return;

  gsap.fromTo(elements,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: animationConfig.stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    }
  );
};

// Text reveal animation with performance checks
export const createTextRevealAnimation = (element: HTMLElement) => {
  if (!element || !animationSettings.enableComplexAnimations) {
    // Fallback to simple fade-in for low-performance devices
    gsap.fromTo(element, 
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 0.5,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
    return;
  }

  const text = element.textContent || '';
  element.innerHTML = text.split('').map(char => 
    char === ' ' ? ' ' : `<span style="display: inline-block; opacity: 0;">${char}</span>`
  ).join('');

  const chars = element.querySelectorAll('span');
  
  gsap.to(chars, {
    opacity: 1,
    duration: 0.05,
    stagger: 0.02,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    }
  });
};

// Cleanup function for ScrollTrigger
export const cleanupAnimations = () => {
  if (typeof window !== 'undefined' && ScrollTrigger) {
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
  }
};