'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getOptimalAnimationSettings } from '@/lib/performance';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'slideLeft' | 'slideRight' | 'stagger' | 'textReveal';
  delay?: number;
  duration?: number;
  trigger?: 'scroll' | 'immediate';
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.8,
  trigger = 'scroll',
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const animationSettings = useRef(
    typeof window !== 'undefined' ? getOptimalAnimationSettings() : null
  );

  // Set mounted state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!elementRef.current || !mounted) return;

    const element = elementRef.current;
    const settings = animationSettings.current;

    // Skip animations if user prefers reduced motion or scroll animations are disabled
    if (settings && (!settings.enableScrollAnimations || !settings.enableComplexAnimations)) {
      // Just fade in without complex animations
      gsap.set(element, { opacity: 1 });
      return;
    }

    // Adjust duration based on performance settings
    const adjustedDuration = settings ? settings.animationDuration * (duration / 0.3) : duration;

    // Initial state based on animation type
    const getInitialState = () => {
      switch (animation) {
        case 'fadeIn':
          return { opacity: 0 };
        case 'slideUp':
          return { opacity: 0, y: 50 };
        case 'scaleIn':
          return { opacity: 0, scale: 0.8 };
        case 'slideLeft':
          return { opacity: 0, x: -50 };
        case 'slideRight':
          return { opacity: 0, x: 50 };
        case 'stagger':
          return { opacity: 0, y: 30 };
        case 'textReveal':
          return { opacity: 0 };
        default:
          return { opacity: 0 };
      }
    };

    // Final state
    const getFinalState = () => {
      switch (animation) {
        case 'fadeIn':
          return { opacity: 1 };
        case 'slideUp':
          return { opacity: 1, y: 0 };
        case 'scaleIn':
          return { opacity: 1, scale: 1 };
        case 'slideLeft':
          return { opacity: 1, x: 0 };
        case 'slideRight':
          return { opacity: 1, x: 0 };
        case 'stagger':
          return { opacity: 1, y: 0 };
        case 'textReveal':
          return { opacity: 1 };
        default:
          return { opacity: 1 };
      }
    };

    // Set initial state
    gsap.set(element, getInitialState());

    // Handle stagger animation for children
    if (animation === 'stagger') {
      const children = element.children;
      if (children.length > 0) {
        gsap.set(children, { opacity: 0, y: 30 });
        
        if (trigger === 'immediate') {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration: adjustedDuration,
            delay,
            stagger: 0.1,
            ease: 'power2.out',
          });
        } else {
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration: adjustedDuration,
            delay,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none none',
              once: true,
            },
          });
        }
      }
      return;
    }

    if (trigger === 'immediate') {
      // Animate immediately
      gsap.to(element, {
        ...getFinalState(),
        duration: adjustedDuration,
        delay,
        ease: 'power2.out',
      });
    } else {
      // Animate on scroll - use 'once: true' to prevent reverse animation
      gsap.to(element, {
        ...getFinalState(),
        duration: adjustedDuration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          end: 'bottom 10%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [animation, delay, duration, trigger, mounted]);

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ opacity: mounted ? undefined : 1 }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;