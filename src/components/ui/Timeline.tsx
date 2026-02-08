'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedSection from './AnimatedSection';

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
}

const Timeline: React.FC<TimelineProps> = ({ items, variant = 'vertical' }) => {
  const { theme } = useTheme();

  const getTypeIcon = (type: 'work' | 'education') => {
    if (type === 'education') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
      </svg>
    );
  };

  if (variant === 'horizontal') {
    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-8 min-w-max">
          {items.map((item, index) => (
            <AnimatedSection
              key={item.id}
              animation="fadeIn"
              delay={index * 100}
              className="flex-shrink-0 w-80"
            >
              <div className="relative">
                {/* Timeline line */}
                {index < items.length - 1 && (
                  <div className="absolute top-6 left-full w-8 h-0.5 bg-primary/30 z-0" />
                )}
                
                {/* Timeline item */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-primary">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full mr-3">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {item.organization}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {item.period}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30" />
      
      <div className="space-y-8">
        {items.map((item, index) => (
          <AnimatedSection
            key={item.id}
            animation="fadeIn"
            delay={index * 150}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full mr-6 relative z-10 shadow-lg">
              {getTypeIcon(item.type)}
            </div>
            
            {/* Timeline content */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-primary">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-primary font-medium">
                    {item.organization}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  {item.period}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default Timeline;