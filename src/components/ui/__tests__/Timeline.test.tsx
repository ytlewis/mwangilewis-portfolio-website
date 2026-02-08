import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline, { TimelineItem } from '../Timeline';
import { ThemeProvider } from '@/contexts/ThemeContext';
import * as fc from 'fast-check';

// Mock the AnimatedSection component to avoid animation complexities in tests
jest.mock('../AnimatedSection', () => {
  return function MockAnimatedSection({ children, className }: any) {
    return <div className={className}>{children}</div>;
  };
});

// Test wrapper with theme context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('Timeline Component - Property 33: Timeline Format Consistency', () => {
  // Arbitrary generator for timeline items
  const timelineItemArbitrary = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    organization: fc.string({ minLength: 1, maxLength: 80 }).filter(s => s.trim().length > 0),
    period: fc.string({ minLength: 4, maxLength: 30 }).filter(s => s.trim().length > 0),
    description: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
    type: fc.constantFrom('work', 'education') as fc.Arbitrary<'work' | 'education'>,
  }) as fc.Arbitrary<TimelineItem>;

  const timelineItemsArbitrary = fc.array(timelineItemArbitrary, { minLength: 1, maxLength: 8 });

  /**
   * Property 33: Timeline Format Consistency
   * **Validates: Requirements 8.3, 8.5**
   * 
   * For any timeline data, the component should maintain consistent formatting
   * and structure regardless of the content provided.
   */
  it('should maintain consistent structure for vertical timeline', () => {
    fc.assert(
      fc.property(timelineItemsArbitrary, (items) => {
        render(
          <TestWrapper>
            <Timeline items={items} variant="vertical" />
          </TestWrapper>
        );

        // Verify each item has consistent structure
        items.forEach((item) => {
          // Check that title is displayed
          const titleElement = screen.getByText(item.title);
          expect(titleElement).toBeInTheDocument();
          expect(titleElement.tagName).toBe('H3');

          // Check that organization is displayed
          const organizationElement = screen.getByText(item.organization);
          expect(organizationElement).toBeInTheDocument();

          // Check that period is displayed
          const periodElement = screen.getByText(item.period);
          expect(periodElement).toBeInTheDocument();

          // Check that description is displayed
          const descriptionElement = screen.getByText(item.description);
          expect(descriptionElement).toBeInTheDocument();
        });

        // Verify timeline structure elements exist
        const timelineDots = document.querySelectorAll('.w-8.h-8.bg-primary');
        expect(timelineDots.length).toBe(items.length);

        // Verify timeline line exists for vertical layout
        const timelineLine = document.querySelector('.absolute.left-4.top-0.bottom-0');
        expect(timelineLine).toBeInTheDocument();
      }),
      { numRuns: 20 }
    );
  });

  it('should maintain consistent structure for horizontal timeline', () => {
    fc.assert(
      fc.property(timelineItemsArbitrary, (items) => {
        render(
          <TestWrapper>
            <Timeline items={items} variant="horizontal" />
          </TestWrapper>
        );

        // Verify each item has consistent structure
        items.forEach((item) => {
          // Check that title is displayed
          const titleElement = screen.getByText(item.title);
          expect(titleElement).toBeInTheDocument();
          expect(titleElement.tagName).toBe('H3');

          // Check that organization is displayed
          const organizationElement = screen.getByText(item.organization);
          expect(organizationElement).toBeInTheDocument();

          // Check that period is displayed
          const periodElement = screen.getByText(item.period);
          expect(periodElement).toBeInTheDocument();

          // Check that description is displayed
          const descriptionElement = screen.getByText(item.description);
          expect(descriptionElement).toBeInTheDocument();
        });

        // Verify horizontal layout structure
        const horizontalContainer = document.querySelector('.flex.space-x-8.min-w-max');
        expect(horizontalContainer).toBeInTheDocument();

        // Verify timeline dots exist
        const timelineDots = document.querySelectorAll('.w-8.h-8.bg-primary');
        expect(timelineDots.length).toBe(items.length);
      }),
      { numRuns: 20 }
    );
  });

  it('should display appropriate icons for different timeline item types', () => {
    fc.assert(
      fc.property(timelineItemsArbitrary, (items) => {
        render(
          <TestWrapper>
            <Timeline items={items} />
          </TestWrapper>
        );

        // Verify that each timeline item has an icon
        const timelineIcons = document.querySelectorAll('.w-4.h-4');
        expect(timelineIcons.length).toBe(items.length);

        // Each icon should be an SVG element
        timelineIcons.forEach((icon) => {
          expect(icon.tagName).toBe('svg');
        });
      }),
      { numRuns: 20 }
    );
  });

  it('should handle empty timeline gracefully', () => {
    render(
      <TestWrapper>
        <Timeline items={[]} />
      </TestWrapper>
    );
    
    // Should render without errors
    const timelineContainer = document.querySelector('.relative');
    expect(timelineContainer).toBeInTheDocument();
    
    // Should have no timeline items
    const timelineDots = document.querySelectorAll('.w-8.h-8.bg-primary');
    expect(timelineDots).toHaveLength(0);
  });

  it('should maintain consistent styling classes across all items', () => {
    fc.assert(
      fc.property(timelineItemsArbitrary, (items) => {
        const { container } = render(
          <TestWrapper>
            <Timeline items={items} />
          </TestWrapper>
        );

        // Verify consistent card styling
        const timelineCards = container.querySelectorAll('.bg-white.dark\\:bg-gray-800.rounded-lg.shadow-lg');
        expect(timelineCards.length).toBe(items.length);

        // Verify consistent border styling
        const borderElements = container.querySelectorAll('.border-l-4.border-primary');
        expect(borderElements.length).toBe(items.length);

        // Verify consistent dot styling
        const dots = container.querySelectorAll('.w-8.h-8.bg-primary.text-white.rounded-full');
        expect(dots.length).toBe(items.length);
      }),
      { numRuns: 20 }
    );
  });

  it('should maintain proper semantic HTML structure', () => {
    fc.assert(
      fc.property(timelineItemsArbitrary, (items) => {
        render(
          <TestWrapper>
            <Timeline items={items} />
          </TestWrapper>
        );

        // Verify proper heading hierarchy
        items.forEach((item) => {
          const titleElement = screen.getByText(item.title);
          expect(titleElement.tagName).toBe('H3');
          expect(titleElement).toHaveClass('font-semibold');
        });

        // Verify organization text has proper styling
        items.forEach((item) => {
          const orgElement = screen.getByText(item.organization);
          expect(orgElement.tagName).toBe('P');
          expect(orgElement).toHaveClass('text-primary');
        });
      }),
      { numRuns: 20 }
    );
  });

  // Unit tests for specific edge cases
  describe('Unit Tests - Specific Examples', () => {
    it('should render a single timeline item correctly', () => {
      const singleItem: TimelineItem = {
        id: 'test-1',
        title: 'Software Developer',
        organization: 'Tech Company',
        period: '2023-2024',
        description: 'Developed web applications',
        type: 'work'
      };

      render(
        <TestWrapper>
          <Timeline items={[singleItem]} />
        </TestWrapper>
      );

      expect(screen.getByText('Software Developer')).toBeInTheDocument();
      expect(screen.getByText('Tech Company')).toBeInTheDocument();
      expect(screen.getByText('2023-2024')).toBeInTheDocument();
      expect(screen.getByText('Developed web applications')).toBeInTheDocument();
    });

    it('should handle mixed work and education items', () => {
      const mixedItems: TimelineItem[] = [
        {
          id: 'work-1',
          title: 'Developer',
          organization: 'Company A',
          period: '2023-2024',
          description: 'Work experience',
          type: 'work'
        },
        {
          id: 'edu-1',
          title: 'Computer Science',
          organization: 'University',
          period: '2020-2023',
          description: 'Education experience',
          type: 'education'
        }
      ];

      render(
        <TestWrapper>
          <Timeline items={mixedItems} />
        </TestWrapper>
      );

      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
      
      // Should have 2 icons (one for each type)
      const icons = document.querySelectorAll('.w-4.h-4');
      expect(icons).toHaveLength(2);
    });
  });
});