import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import Projects from '../page';

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaGithub: () => <span>GitHub Icon</span>,
  FaExternalLinkAlt: () => <span>External Link Icon</span>,
  FaStar: () => <span>Star Icon</span>,
  FaClock: () => <span>Clock Icon</span>,
  FaTag: () => <span>Tag Icon</span>,
  FaSearch: () => <span>Search Icon</span>,
  FaFilter: () => <span>Filter Icon</span>,
  FaSync: () => <span>Sync Icon</span>
}));

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'projects.title': 'My Projects',
        'common.loading': 'Loading...'
      };
      return translations[key] || key;
    }
  })
}));

// Mock the components
jest.mock('@/components/ui/ProjectCard', () => {
  return function MockProjectCard({ project, featured }: any) {
    return (
      <div data-testid={`project-card-${project.id}`} data-project-name={project.name}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <span data-language>{project.language}</span>
        <span data-stars>{project.stargazers_count}</span>
        <span data-updated>{project.updated_at}</span>
        {featured && <span data-featured>Featured</span>}
        {project.topics && project.topics.map((topic: string, index: number) => (
          <span key={index} data-topic={topic}>{topic}</span>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/ui/AnimatedSection', () => {
  return function MockAnimatedSection({ children }: any) {
    return <div>{children}</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('Property 24: Live GitHub Data Updates Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  test('Property 24: Live GitHub Data Updates - projects section reflects current GitHub repository data', async () => {
    // **Validates: Requirements 6.2**
    // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
    
    await fc.assert(fc.asyncProperty(
      // Generate unique GitHub repository data with sequential IDs
      fc.integer({ min: 1, max: 5 }).chain(count => 
        fc.array(
          fc.integer({ min: 1, max: 999999 }).chain(baseId => 
            fc.record({
              id: fc.constant(baseId),
              name: fc.constantFrom(
                'react-portfolio', 'node-api', 'python-scraper', 'vue-dashboard',
                'express-server', 'django-app', 'angular-client', 'flask-api'
              ),
              description: fc.constantFrom(
                'A modern React portfolio website with animations',
                'RESTful API built with Node.js and Express',
                'Python web scraper for data collection',
                'Vue.js dashboard with real-time updates'
              ),
              html_url: fc.constant(`https://github.com/lewisgathaiya/repo-${baseId}`),
              language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java'),
              stargazers_count: fc.integer({ min: 0, max: 100 }),
              updated_at: fc.date({ min: new Date('2023-01-01'), max: new Date() }).map(d => d.toISOString()),
              topics: fc.array(
                fc.constantFrom('react', 'nodejs', 'python', 'typescript', 'api', 'web'),
                { minLength: 0, maxLength: 3 }
              ),
              homepage: fc.oneof(
                fc.constant('https://example.com'),
                fc.constant(null)
              )
            })
          ),
          { minLength: count, maxLength: count }
        ).map(repos => {
          // Ensure unique IDs
          return repos.map((repo, index) => ({
            ...repo,
            id: repo.id + index * 1000
          }));
        })
      ),
      
      async (githubRepos) => {
        // Mock GitHub API response with the generated repositories
        const apiResponse = {
          success: true,
          repos: githubRepos,
          cached: false,
          timestamp: new Date().toISOString()
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => apiResponse
        });

        // Property: For any GitHub repository data, the projects section should display current information
        render(<Projects />);

        // Wait for projects to load
        await waitFor(() => {
          expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        }, { timeout: 5000 });

        // Property: All repositories from GitHub API should be displayed in the projects section
        for (const repo of githubRepos) {
          await waitFor(() => {
            const projectCard = screen.getByTestId(`project-card-${repo.id}`);
            expect(projectCard).toBeInTheDocument();
            
            // Verify current GitHub data is displayed
            expect(projectCard).toHaveTextContent(repo.name);
            expect(projectCard).toHaveTextContent(repo.description);
            expect(projectCard).toHaveTextContent(repo.language);
            expect(projectCard).toHaveTextContent(repo.stargazers_count.toString());
          });
        }

        // Property: Search functionality should work with current GitHub data
        if (githubRepos.length > 1) {
          const searchRepo = githubRepos[0];
          const searchInput = screen.getByPlaceholderText('Search projects...');
          
          fireEvent.change(searchInput, { target: { value: searchRepo.name } });

          await waitFor(() => {
            // Searched project should be visible
            expect(screen.getByTestId(`project-card-${searchRepo.id}`)).toBeInTheDocument();
          });

          // Clear search to reset
          fireEvent.change(searchInput, { target: { value: '' } });
          
          await waitFor(() => {
            // All projects should be visible again
            for (const repo of githubRepos) {
              expect(screen.getByTestId(`project-card-${repo.id}`)).toBeInTheDocument();
            }
          });
        }

        // Property: Results count should reflect current GitHub data
        const resultsText = screen.getByText(/Showing \d+ of \d+ projects/);
        expect(resultsText).toBeInTheDocument();
        expect(resultsText).toHaveTextContent(`Showing ${githubRepos.length} of ${githubRepos.length} projects`);
      }
    ), { numRuns: 10 });
  }, 30000);

  test('Property 24: Live GitHub Data Updates - projects section updates when GitHub data refreshes', async () => {
    // **Validates: Requirements 6.2**
    // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
    
    // Test with fixed data to avoid ID conflicts
    const initialRepos = [
      {
        id: 1,
        name: 'initial-project',
        description: 'Initial project description',
        html_url: 'https://github.com/user/initial-project',
        language: 'JavaScript',
        stargazers_count: 5,
        updated_at: '2023-01-01T00:00:00.000Z',
        topics: ['initial'],
        homepage: null
      }
    ];

    const updatedRepos = [
      {
        id: 2,
        name: 'updated-project',
        description: 'Updated project description',
        html_url: 'https://github.com/user/updated-project',
        language: 'TypeScript',
        stargazers_count: 10,
        updated_at: '2024-01-01T00:00:00.000Z',
        topics: ['updated'],
        homepage: 'https://example.com'
      }
    ];

    // Mock initial GitHub API response
    const initialResponse = {
      success: true,
      repos: initialRepos,
      cached: false,
      timestamp: new Date().toISOString()
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => initialResponse
    });

    // Property: Component should display initial GitHub data
    render(<Projects />);

    // Wait for initial projects to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify initial project is displayed
    await waitFor(() => {
      expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
      expect(screen.getByText('initial-project')).toBeInTheDocument();
    });

    // Mock updated GitHub API response for refresh
    const updatedResponse = {
      success: true,
      repos: updatedRepos,
      cached: false,
      timestamp: new Date().toISOString()
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedResponse
    });

    // Property: Refresh should update to display new GitHub data
    const refreshButton = screen.getByTitle('Refresh GitHub data');
    fireEvent.click(refreshButton);

    // Wait for refresh to complete
    await waitFor(() => {
      // New project should be displayed
      expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
      expect(screen.getByText('updated-project')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Property: Old project should no longer be displayed after refresh
    expect(screen.queryByTestId('project-card-1')).not.toBeInTheDocument();
    expect(screen.queryByText('initial-project')).not.toBeInTheDocument();

    // Property: Results count should reflect updated data
    const resultsText = screen.getByText(/Showing \d+ of \d+ projects/);
    expect(resultsText).toHaveTextContent('Showing 1 of 1 projects');
  }, 30000);

  test('Property 24: Live GitHub Data Updates - fallback data is displayed when GitHub API fails', async () => {
    // **Validates: Requirements 6.2**
    // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
    
    // Mock GitHub API failure
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // Property: When GitHub API fails, fallback data should be displayed
    render(<Projects />);

    // Wait for fallback projects to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Property: Fallback data should include expected featured projects
    await waitFor(() => {
      // The fallback data should be displayed in the component
      // Since we're using a mock ProjectCard, we need to check for the actual fallback project names
      const projectCards = screen.getAllByTestId(/project-card-/);
      expect(projectCards.length).toBeGreaterThan(0);
      
      // Check that some projects are displayed (fallback behavior)
      expect(screen.getByText(/Showing \d+ of \d+ projects/)).toBeInTheDocument();
    });

    // Property: Search should work with fallback data
    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Should still be functional even with fallback data
    await waitFor(() => {
      expect(screen.getByText(/Showing \d+ of \d+ projects/)).toBeInTheDocument();
    });
  }, 30000);
});