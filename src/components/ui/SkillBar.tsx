'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SkillBarProps {
  skill: string;
  percentage: number;
  color?: string;
  animated?: boolean;
  delay?: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ 
  skill, 
  percentage, 
  color, 
  animated = true,
  delay = 0 
}) => {
  const { theme } = useTheme();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const skillBarRef = useRef<HTMLDivElement>(null);

  // Use primary color if no color specified
  const barColor = color || (theme === 'dark' ? '#E63946' : '#E63946');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Start animation after delay
          setTimeout(() => {
            if (animated) {
              animateProgress();
            } else {
              setAnimatedPercentage(percentage);
            }
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (skillBarRef.current) {
      observer.observe(skillBarRef.current);
    }

    return () => observer.disconnect();
  }, [animated, delay, percentage, isVisible]);

  const animateProgress = () => {
    let current = 0;
    const increment = percentage / 60; // 60 frames for smooth animation
    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        current = percentage;
        clearInterval(timer);
      }
      setAnimatedPercentage(Math.round(current));
    }, 16); // ~60fps
  };

  return (
    <div ref={skillBarRef} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {skill}
        </span>
        <span className="text-sm font-bold" style={{ color: barColor }}>
          {animatedPercentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animatedPercentage}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}40`
          }}
        />
      </div>
    </div>
  );
};

export default SkillBar;