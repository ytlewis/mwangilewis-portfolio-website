import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';

// Mock react-icons before any imports
jest.mock('react-icons/fa', () => ({
  FaGithub: () => React.createElement('span', {}, 'GitHub Icon'),
  FaExternalLinkAlt: () => React.createElement('span', {}, 'External Link Icon'),
  FaStar: () => React.createElement('span', {}, 'Star Icon'),
  FaClock: () => React.createElement('span', {}, 'Clock Icon'),
  FaTag: () => React.createElement('span', {}, 'Tag Icon'),
  FaSearch: () => React.createElement('span', {}, 'Search Icon'),
  FaFilter: () => React.createElement('span', {}, 'Filter Icon'),
  FaSync: () => React.createElement('span', {}, 'Sync Icon')
}));

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'projects.viewCode': 'View Code',
        'projects.viewProject': 'View Project'
      };
      return translations[key] || key;
    }
  })
}));

// Mock the animation hooks
jest.mock('@/hooks/useAnimations', () => ({
  useImageHover: () => ({ current: null })
}));

// Mock AnimatedImage and AnimatedButton components
jest.mock('@/components/ui/AnimatedImage', () => {
  return function MockAnimatedImage({ src, alt, ...props }: any) {
    return React.createElement('img', { src, alt, ...props });
  };
});

jest.mock('@/components/ui/AnimatedButton', () => {
  return function MockAnimatedButton({ children, onClick, ...props }: any) {
    return React.createElement('button', { onClick, ...props }, children);
  };
});

// Now import the component after all mocks are set up
import ProjectCard from '../ProjectCard';

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
});

describe('ProjectCard Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Unit Tests', () => {
    const mockProject = {
      id: 1,
      name: 'test-project',
      description: 'A test project description',
      html_url: 'https://github.com/user/test-project',
      language: 'JavaScript',
      stargazers_count: 5,
      updated_at: '2024-01-01T00:00:00Z',
      topics: ['test', 'project'],
      homepage: 'https://example.com'
    };

    test('renders project card with all required information', () => {
      render(<ProjectCard project={mockProject} />);

      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('A test project description')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('View Code')).toBeInTheDocument();
      expect(screen.getByText('View Project')).toBeInTheDocument();
    });

    test('handles featured project styling', () => {
      render(<ProjectCard project={mockProject} featured={true} />);
      
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    test('handles project without homepage', () => {
      const projectWithoutHomepage = { ...mockProject, homepage: null };
      render(<ProjectCard project={projectWithoutHomepage} />);

      expect(screen.getByText('View Code')).toBeInTheDocument();
      expect(screen.queryByText('View Project')).not.toBeInTheDocument();
    });

    test('handles project with zero stars', () => {
      const projectWithoutStars = { ...mockProject, stargazers_count: 0 };
      render(<ProjectCard project={projectWithoutStars} />);

      // Star badge should not be visible for projects with 0 stars
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    test('handles project with stars', () => {
      const projectWithStars = { ...mockProject, stargazers_count: 10 };
      render(<ProjectCard project={projectWithStars} />);

      expect(screen.getByText('10')).toBeInTheDocument();
    });

    test('handles click events for GitHub and homepage links', () => {
      render(<ProjectCard project={mockProject} />);

      const viewCodeButton = screen.getByText('View Code');
      const viewProjectButton = screen.getByText('View Project');

      fireEvent.click(viewCodeButton);
      expect(mockWindowOpen).toHaveBeenCalledWith('https://github.com/user/test-project', '_blank');

      fireEvent.click(viewProjectButton);
      expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com', '_blank');
    });

    test('displays topics correctly', () => {
      render(<ProjectCard project={mockProject} />);

      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('project')).toBeInTheDocument();
    });

    test('handles projects with many topics', () => {
      const projectWithManyTopics = {
        ...mockProject,
        topics: ['topic1', 'topic2', 'topic3', 'topic4', 'topic5']
      };
      render(<ProjectCard project={projectWithManyTopics} />);

      // Should show first 3 topics
      expect(screen.getByText('topic1')).toBeInTheDocument();
      expect(screen.getByText('topic2')).toBeInTheDocument();
      expect(screen.getByText('topic3')).toBeInTheDocument();
      
      // Should show "+2 more" indicator
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    test('formats project name correctly', () => {
      const projectWithDashes = {
        ...mockProject,
        name: 'my-awesome-project'
      };
      render(<ProjectCard project={projectWithDashes} />);

      // Should convert dashes to spaces and capitalize words
      expect(screen.getByText('My Awesome Project')).toBeInTheDocument();
    });

    test('displays relative time correctly', () => {
      const recentProject = {
        ...mockProject,
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      };
      render(<ProjectCard project={recentProject} />);

      expect(screen.getByText(/Updated 1 day ago/)).toBeInTheDocument();
    });
  });

  describe('Property-Based Tests', () => {
    test('Property 24: Live GitHub Data Updates - project cards display current GitHub repository data', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate various GitHub repository data scenarios
        fc.record({
          id: fc.integer({ min: 1, max: 999999 }),
          name: fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length >= 3).map(s => s.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 30) || 'test-repo'),
          description: fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length >= 10),
          html_url: fc.string({ minLength: 3, maxLength: 20 }).map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
          language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'PHP'),
          stargazers_count: fc.integer({ min: 0, max: 10000 }),
          updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
          topics: fc.array(fc.string({ minLength: 3, maxLength: 15 }).filter(s => s.trim().length >= 3), { minLength: 0, maxLength: 8 }),
          homepage: fc.oneof(
            fc.webUrl(),
            fc.constant(null),
            fc.constant('')
          )
        }),
        fc.boolean(), // featured flag
        fc.integer({ min: 0, max: 1000 }), // delay
        
        async (githubRepo, featured, delay) => {
          // Property: For any GitHub repository data, the ProjectCard should display all current information
          
          const { container } = render(
            <ProjectCard 
              project={githubRepo} 
              featured={featured}
              delay={delay}
            />
          );

          // Property: All GitHub repository data should be reflected in the UI
          
          // Repository name should be displayed (formatted)
          const formattedName = githubRepo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const nameElement = container.querySelector('h3');
          expect(nameElement).toHaveTextContent(formattedName);

          // Repository description should be displayed
          const descriptionElement = container.querySelector('p');
          expect(descriptionElement).toHaveTextContent(githubRepo.description);

          // Repository language should be displayed
          expect(container).toHaveTextContent(githubRepo.language);

          // Repository URL should be accessible via View Code button
          const viewCodeButton = container.querySelector('button');
          expect(viewCodeButton).toHaveTextContent('View Code');
          
          // Star count should be displayed if greater than 0
          if (githubRepo.stargazers_count > 0) {
            expect(container).toHaveTextContent(githubRepo.stargazers_count.toString());
          }

          // Updated date should be displayed in relative format
          const updatedDate = new Date(githubRepo.updated_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            expect(screen.getByText(/Updated 1 day ago/)).toBeInTheDocument();
          } else if (diffDays < 30) {
            expect(screen.getByText(new RegExp(`Updated ${diffDays} days ago`))).toBeInTheDocument();
          } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            expect(screen.getByText(new RegExp(`Updated ${months} months? ago`))).toBeInTheDocument();
          } else {
            const years = Math.floor(diffDays / 365);
            expect(screen.getByText(new RegExp(`Updated ${years} years? ago`))).toBeInTheDocument();
          }

          // Topics should be displayed (up to 3, with overflow indicator)
          if (githubRepo.topics && githubRepo.topics.length > 0) {
            const displayedTopics = githubRepo.topics.slice(0, 3);
            displayedTopics.forEach(topic => {
              expect(container).toHaveTextContent(topic);
            });

            if (githubRepo.topics.length > 3) {
              const remainingCount = githubRepo.topics.length - 3;
              expect(container).toHaveTextContent(`+${remainingCount} more`);
            }
          }

          // Homepage link should be available if provided
          if (githubRepo.homepage && githubRepo.homepage.trim() !== '') {
            expect(container).toHaveTextContent('View Project');
          } else {
            expect(container.querySelector('button[variant="outline"]')).toBeNull();
          }

          // Featured badge should be displayed if featured
          if (featured) {
            expect(container).toHaveTextContent('Featured');
          } else {
            expect(container.querySelector('.bg-red-600')).toBeNull();
          }

          // Property: All interactive elements should be functional
          
          // Test GitHub link functionality
          const githubButton = container.querySelector('button');
          if (githubButton) {
            fireEvent.click(githubButton);
            expect(mockWindowOpen).toHaveBeenCalledWith(githubRepo.html_url, '_blank');
          }

          // Test homepage link functionality if available
          if (githubRepo.homepage && githubRepo.homepage.trim() !== '') {
            const buttons = container.querySelectorAll('button');
            const homepageButton = Array.from(buttons).find(btn => btn.textContent?.includes('View Project'));
            if (homepageButton) {
              fireEvent.click(homepageButton);
              expect(mockWindowOpen).toHaveBeenCalledWith(githubRepo.homepage, '_blank');
            }
          }

          // Property: Component should handle edge cases gracefully
          
          // Component should not crash with any valid GitHub data
          expect(container).toBeInTheDocument();
          
          // All required elements should be present
          expect(screen.getByText(formattedName)).toBeInTheDocument();
          expect(screen.getByText(githubRepo.description)).toBeInTheDocument();
          expect(screen.getByText(githubRepo.language)).toBeInTheDocument();
          expect(viewCodeButton).toBeInTheDocument();

          // Property: Data should be current and reflect live GitHub state
          // (This is validated by ensuring all provided GitHub data is displayed)
          
          // Verify that the component displays exactly the data provided
          // without any stale or cached information interfering
          const displayedName = nameElement?.textContent;
          const displayedDescription = descriptionElement?.textContent;
          
          expect(displayedName).toBe(formattedName);
          expect(displayedDescription).toBe(githubRepo.description);
          expect(container).toHaveTextContent(githubRepo.language);
        }
      ), { numRuns: 50 });
    }, 30000);

    test('Property 24: Live GitHub Data Updates - project cards handle data updates correctly', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate initial and updated GitHub repository data
        fc.record({
          initial: fc.record({
            id: fc.integer({ min: 1, max: 999999 }),
            name: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3).map(s => s.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 20) || 'initial-repo'),
            description: fc.string({ minLength: 10, maxLength: 80 }).filter(s => s.trim().length >= 10),
            html_url: fc.string({ minLength: 3, maxLength: 15 }).map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
            language: fc.constantFrom('JavaScript', 'Python', 'TypeScript'),
            stargazers_count: fc.integer({ min: 0, max: 100 }),
            updated_at: fc.date({ min: new Date('2023-01-01'), max: new Date('2023-12-31') }).map(d => d.toISOString()),
            topics: fc.array(fc.string({ minLength: 3, maxLength: 10 }).filter(s => s.trim().length >= 3), { minLength: 0, maxLength: 5 }),
            homepage: fc.oneof(fc.webUrl(), fc.constant(null))
          }),
          updated: fc.record({
            // Keep same ID and name, but allow other fields to change
            description: fc.string({ minLength: 10, maxLength: 80 }).filter(s => s.trim().length >= 10),
            language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java'),
            stargazers_count: fc.integer({ min: 0, max: 200 }),
            updated_at: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map(d => d.toISOString()),
            topics: fc.array(fc.string({ minLength: 3, maxLength: 10 }).filter(s => s.trim().length >= 3), { minLength: 0, maxLength: 6 }),
            homepage: fc.oneof(fc.webUrl(), fc.constant(null))
          })
        }),
        
        async (repoData) => {
          // Create initial and updated repository objects
          const initialRepo = repoData.initial;
          const updatedRepo = {
            ...initialRepo,
            ...repoData.updated,
            id: initialRepo.id, // Keep same ID
            name: initialRepo.name, // Keep same name
            html_url: initialRepo.html_url // Keep same URL
          };

          // Property: Component should display initial GitHub data correctly
          const { rerender, container } = render(<ProjectCard project={initialRepo} />);

          const formattedName = initialRepo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const nameElement = container.querySelector('h3');
          const descriptionElement = container.querySelector('p');
          
          expect(nameElement).toHaveTextContent(formattedName);
          expect(descriptionElement).toHaveTextContent(initialRepo.description);
          expect(container).toHaveTextContent(initialRepo.language);

          // Property: Component should update to reflect new GitHub data when props change
          rerender(<ProjectCard project={updatedRepo} />);

          // Updated data should now be displayed
          expect(nameElement).toHaveTextContent(formattedName); // Name stays same
          const updatedDescriptionElement = container.querySelector('p');
          expect(updatedDescriptionElement).toHaveTextContent(updatedRepo.description);
          expect(container).toHaveTextContent(updatedRepo.language);

          // Old data should no longer be displayed (if different)
          if (initialRepo.description !== updatedRepo.description) {
            // Since we're using container-based queries, we just verify the current content
            expect(updatedDescriptionElement).not.toHaveTextContent(initialRepo.description);
          }

          // Property: Star count should reflect current GitHub data
          if (updatedRepo.stargazers_count > 0) {
            expect(container).toHaveTextContent(updatedRepo.stargazers_count.toString());
          }

          // Property: Topics should reflect current GitHub data
          if (updatedRepo.topics && updatedRepo.topics.length > 0) {
            const displayedTopics = updatedRepo.topics.slice(0, 3);
            displayedTopics.forEach(topic => {
              expect(container).toHaveTextContent(topic);
            });
          }

          // Property: Homepage link availability should reflect current GitHub data
          if (updatedRepo.homepage && updatedRepo.homepage.trim() !== '') {
            expect(container).toHaveTextContent('View Project');
          }

          // Property: Component should maintain functionality with updated data
          const viewCodeButton = container.querySelector('button');
          if (viewCodeButton) {
            fireEvent.click(viewCodeButton);
            expect(mockWindowOpen).toHaveBeenCalledWith(updatedRepo.html_url, '_blank');
          }
        }
      ), { numRuns: 25 });
    }, 30000);
  });
});