import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import SkillBar from '../SkillBar';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Helper component to wrap SkillBar with ThemeProvider
const SkillBarWithTheme = ({ skill, percentage, color, animated, delay }: {
  skill: string;
  percentage: number;
  color?: string;
  animated?: boolean;
  delay?: number;
}) => (
  <ThemeProvider>
    <SkillBar 
      skill={skill} 
      percentage={percentage} 
      color={color} 
      animated={animated} 
      delay={delay} 
    />
  </ThemeProvider>
);

describe('SkillBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Unit tests for specific examples
  test('renders skill name and percentage', () => {
    render(
      <SkillBarWithTheme 
        skill="JavaScript" 
        percentage={85} 
        animated={false}
      />
    );
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  test('renders with custom color', () => {
    render(
      <SkillBarWithTheme 
        skill="React" 
        percentage={90} 
        color="#61DAFB" 
        animated={false}
      />
    );
    
    const progressBar = document.querySelector('.h-2\\.5.rounded-full.transition-all');
    expect(progressBar).toHaveStyle('background-color: #61DAFB');
  });

  test('handles zero percentage', () => {
    render(
      <SkillBarWithTheme 
        skill="New Skill" 
        percentage={0} 
        animated={false}
      />
    );
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    const progressBar = document.querySelector('.h-2\\.5.rounded-full.transition-all');
    expect(progressBar).toHaveStyle('width: 0%');
  });

  test('handles maximum percentage', () => {
    render(
      <SkillBarWithTheme 
        skill="Expert Skill" 
        percentage={100} 
        animated={false}
      />
    );
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    const progressBar = document.querySelector('.h-2\\.5.rounded-full.transition-all');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  // Property-based test for skills progress bars
  test('Property 32: Skills Progress Bar Animation - Feature: lewis-portfolio-website, Property 32: Skills Progress Bar Animation', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 50 }), // skill name
      fc.integer({ min: 0, max: 100 }), // percentage
      fc.option(fc.hexaString({ minLength: 6, maxLength: 6 }).map(hex => `#${hex}`)), // optional color
      fc.boolean(), // animated flag
      fc.option(fc.integer({ min: 0, max: 1000 })), // optional delay
      (skill, percentage, color, animated, delay) => {
        const { container, unmount } = render(
          <SkillBarWithTheme 
            skill={skill}
            percentage={percentage}
            color={color || undefined}
            animated={animated}
            delay={delay || undefined}
          />
        );

        // Property: Skill name should be displayed
        const skillElement = screen.getByText(skill);
        expect(skillElement).toBeInTheDocument();

        // Property: Percentage should be displayed and match input
        const percentageElement = screen.getByText(`${percentage}%`);
        expect(percentageElement).toBeInTheDocument();

        // Property: Progress bar should exist
        const progressBar = container.querySelector('.h-2\\.5.rounded-full.transition-all');
        expect(progressBar).toBeInTheDocument();

        // Property: Progress bar width should correspond to percentage (when not animated)
        if (!animated) {
          expect(progressBar).toHaveStyle(`width: ${percentage}%`);
        }

        // Property: Custom color should be applied when provided
        if (color) {
          expect(progressBar).toHaveStyle(`background-color: ${color}`);
        }

        // Property: Progress bar should have proper styling classes
        expect(progressBar).toHaveClass('h-2.5', 'rounded-full', 'transition-all');

        // Property: Container should have proper structure
        const skillBarContainer = container.querySelector('.mb-6');
        expect(skillBarContainer).toBeInTheDocument();

        // Property: Should have skill name and percentage in header
        const header = container.querySelector('.flex.justify-between.items-center.mb-2');
        expect(header).toBeInTheDocument();

        // Property: Should have progress bar background container
        const progressContainer = container.querySelector('.w-full.bg-gray-200.dark\\:bg-gray-700.rounded-full.h-2\\.5.overflow-hidden');
        expect(progressContainer).toBeInTheDocument();

        unmount();
      }
    ), { numRuns: 20 });
  });

  // Property test for animation behavior
  test('Property 32: Skills Progress Bar Animation - Animation behavior validation', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 30 }),
      fc.integer({ min: 1, max: 100 }),
      fc.boolean(),
      (skill, percentage, animated) => {
        const { container, unmount } = render(
          <SkillBarWithTheme 
            skill={skill}
            percentage={percentage}
            animated={animated}
          />
        );

        const progressBar = container.querySelector('.h-2\\.5.rounded-full.transition-all');
        
        // Property: Progress bar should always exist regardless of animation setting
        expect(progressBar).toBeInTheDocument();
        
        // Property: Progress bar should have transition classes for smooth animation
        expect(progressBar).toHaveClass('transition-all', 'duration-1000', 'ease-out');
        
        // Property: Progress bar should have proper height and styling
        expect(progressBar).toHaveClass('h-2.5', 'rounded-full');

        unmount();
      }
    ), { numRuns: 20 });
  });

  // Property test for accessibility and structure
  test('Property 32: Skills Progress Bar Animation - Accessibility and structure validation', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 40 }),
      fc.integer({ min: 0, max: 100 }),
      (skill, percentage) => {
        const { container, unmount } = render(
          <SkillBarWithTheme 
            skill={skill}
            percentage={percentage}
            animated={false}
          />
        );

        // Property: Skill name should be accessible and properly styled
        const skillNameElement = screen.getByText(skill);
        expect(skillNameElement).toBeInTheDocument();
        expect(skillNameElement).toHaveClass('text-sm', 'font-medium');

        // Property: Percentage should be accessible and properly styled
        const percentageElement = screen.getByText(`${percentage}%`);
        expect(percentageElement).toBeInTheDocument();
        expect(percentageElement).toHaveClass('text-sm', 'font-bold');

        // Property: Progress bar container should have proper ARIA structure
        const progressContainer = container.querySelector('.w-full.bg-gray-200.dark\\:bg-gray-700');
        expect(progressContainer).toBeInTheDocument();
        expect(progressContainer).toHaveClass('rounded-full', 'h-2.5', 'overflow-hidden');

        // Property: Component should have consistent spacing
        const mainContainer = container.querySelector('.mb-6');
        expect(mainContainer).toBeInTheDocument();

        unmount();
      }
    ), { numRuns: 20 });
  });
});