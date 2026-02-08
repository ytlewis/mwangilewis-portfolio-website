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
      <div data-testid={`project-card-${project.id}`}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <span>{project.language}</span>
        {featured && <span>Featured</span>}
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

describe('Projects Page Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('Unit Tests', () => {
    test('renders projects page with title', async () => {
      // Mock successful API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          repos: [
            {
              id: 1,
              name: 'test-project',
              description: 'A test project',
              html_url: 'https://github.com/user/test-project',
              language: 'JavaScript',
              stargazers_count: 5,
              updated_at: '2024-01-01T00:00:00Z',
              topics: ['test']
            }
          ],
          cached: false,
          timestamp: new Date().toISOString()
        })
      });

      render(<Projects />);

      expect(screen.getByText('My Projects')).toBeInTheDocument();
      
      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
      });
    });

    test('displays loading state initially', () => {
      // Mock pending API response
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

      render(<Projects />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('handles API error gracefully', async () => {
      // Mock API error
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load projects/)).toBeInTheDocument();
      });

      // Should still show fallback projects
      await waitFor(() => {
        expect(screen.getByText('PHARMUP')).toBeInTheDocument();
        expect(screen.getByText('SECULEARN')).toBeInTheDocument();
      });
    });

    test('search functionality filters projects', async () => {
      // Mock API response with multiple projects
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          repos: [
            {
              id: 1,
              name: 'react-project',
              description: 'A React project',
              html_url: 'https://github.com/user/react-project',
              language: 'JavaScript',
              stargazers_count: 5,
              updated_at: '2024-01-01T00:00:00Z',
              topics: ['react']
            },
            {
              id: 2,
              name: 'python-script',
              description: 'A Python script',
              html_url: 'https://github.com/user/python-script',
              language: 'Python',
              stargazers_count: 3,
              updated_at: '2024-01-01T00:00:00Z',
              topics: ['python']
            }
          ],
          cached: false,
          timestamp: new Date().toISOString()
        })
      });

      render(<Projects />);

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
      });

      // Search for "react"
      const searchInput = screen.getByPlaceholderText('Search projects...');
      fireEvent.change(searchInput, { target: { value: 'react' } });

      // Should show only React project
      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
        expect(screen.queryByTestId('project-card-2')).not.toBeInTheDocument();
      });
    });

    test('language filter works correctly', async () => {
      // Mock API response with projects in different languages
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          repos: [
            {
              id: 1,
              name: 'js-project',
              description: 'JavaScript project',
              html_url: 'https://github.com/user/js-project',
              language: 'JavaScript',
              stargazers_count: 5,
              updated_at: '2024-01-01T00:00:00Z',
              topics: []
            },
            {
              id: 2,
              name: 'py-project',
              description: 'Python project',
              html_url: 'https://github.com/user/py-project',
              language: 'Python',
              stargazers_count: 3,
              updated_at: '2024-01-01T00:00:00Z',
              topics: []
            }
          ],
          cached: false,
          timestamp: new Date().toISOString()
        })
      });

      render(<Projects />);

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
      });

      // Filter by Python
      const languageSelect = screen.getByDisplayValue('All Languages');
      fireEvent.change(languageSelect, { target: { value: 'Python' } });

      // Should show only Python project
      await waitFor(() => {
        expect(screen.queryByTestId('project-card-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
      });
    });

    test('featured projects are highlighted', async () => {
      // Mock API response with PHARMUP and SECULEARN
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          repos: [
            {
              id: 1,
              name: 'PHARMUP',
              description: 'Pharmaceutical management system',
              html_url: 'https://github.com/user/pharmup',
              language: 'JavaScript',
              stargazers_count: 10,
              updated_at: '2024-01-01T00:00:00Z',
              topics: ['pharmacy']
            },
            {
              id: 2,
              name: 'regular-project',
              description: 'Regular project',
              html_url: 'https://github.com/user/regular-project',
              language: 'JavaScript',
              stargazers_count: 5,
              updated_at: '2024-01-01T00:00:00Z',
              topics: []
            }
          ],
          cached: false,
          timestamp: new Date().toISOString()
        })
      });

      render(<Projects />);

      // Wait for projects to load
      await waitFor(() => {
        const pharmupCard = screen.getByTestId('project-card-1');
        const regularCard = screen.getByTestId('project-card-2');
        
        expect(pharmupCard).toBeInTheDocument();
        expect(regularCard).toBeInTheDocument();
        
        // PHARMUP should be featured
        expect(pharmupCard).toHaveTextContent('Featured');
        expect(regularCard).not.toHaveTextContent('Featured');
      });
    });

    test('refresh functionality works', async () => {
      // Mock initial API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          repos: [
            {
              id: 1,
              name: 'initial-project',
              description: 'Initial project',
              html_url: 'https://github.com/user/initial-project',
              language: 'JavaScript',
              stargazers_count: 5,
              updated_at: '2024-01-01T00:00:00Z',
              topics: []
            }
          ],
          cached: false,
          timestamp: new Date().toISOString()
        })
      });

      render(<Projects />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
      });

      // Mock refresh API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          repos: [
            {
              id: 2,
              name: 'refreshed-project',
              description: 'Refreshed project',
              html_url: 'https://github.com/user/refreshed-project',
              language: 'Python',
              stargazers_count: 8,
              updated_at: '2024-01-02T00:00:00Z',
              topics: []
            }
          ],
          cached: false,
          timestamp: new Date().toISOString()
        })
      });

      // Click refresh button
      const refreshButton = screen.getByTitle('Refresh GitHub data');
      fireEvent.click(refreshButton);

      // Wait for refresh to complete
      await waitFor(() => {
        expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
        expect(screen.queryByTestId('project-card-1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Property-Based Tests', () => {
    test('Property 24: Live GitHub Data Updates - projects section displays current GitHub repository data', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate various GitHub API response scenarios
        fc.record({
          success: fc.constant(true),
          repos: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 999999 }),
              name: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3).map(s => s.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 20) || 'test-repo'),
              description: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10),
              html_url: fc.string({ minLength: 3, maxLength: 15 }).map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
              language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Go'),
              stargazers_count: fc.integer({ min: 0, max: 1000 }),
              updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
              topics: fc.array(fc.string({ minLength: 3, maxLength: 10 }).filter(s => s.trim().length >= 3), { minLength: 0, maxLength: 5 }),
              homepage: fc.oneof(fc.webUrl(), fc.constant(null))
            }),
            { minLength: 1, maxLength: 6 }
          ),
          cached: fc.boolean(),
          timestamp: fc.date().map(d => d.toISOString())
        }),
        
        async (apiResponse) => {
          // Mock the GitHub API response
          (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => apiResponse
          });

          // Property: For any GitHub API response, the projects section should display all repository data
          render(<Projects />);

          // Wait for projects to load
          await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
          }, { timeout: 3000 });

          // Property: All repositories from the API should be displayed
          for (const repo of apiResponse.repos) {
            await waitFor(() => {
              expect(screen.getByTestId(`project-card-${repo.id}`)).toBeInTheDocument();
            });

            const projectCard = screen.getByTestId(`project-card-${repo.id}`);
            
            // Property: Each project card should display current GitHub data
            expect(projectCard).toHaveTextContent(repo.name);
            expect(projectCard).toHaveTextContent(repo.description);
            expect(projectCard).toHaveTextContent(repo.language);
          }

          // Property: Featured projects should be properly identified and highlighted
          const featuredProjects = ['pharmup', 'seculearn'];
          const featuredRepos = apiResponse.repos.filter(repo => 
            featuredProjects.some(featured => 
              repo.name.toLowerCase().includes(featured.toLowerCase())
            )
          );

          for (const featuredRepo of featuredRepos) {
            const featuredCard = screen.getByTestId(`project-card-${featuredRepo.id}`);
            expect(featuredCard).toHaveTextContent('Featured');
          }

          // Property: Search functionality should work with current GitHub data
          if (apiResponse.repos.length > 1) {
            const searchTerm = apiResponse.repos[0].name.substring(0, 3);
            const searchInput = screen.getByPlaceholderText('Search projects...');
            
            fireEvent.change(searchInput, { target: { value: searchTerm } });

            // Should filter projects based on current data
            await waitFor(() => {
              const matchingRepos = apiResponse.repos.filter(repo =>
                repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (repo.topics && repo.topics.some(topic => 
                  topic.toLowerCase().includes(searchTerm.toLowerCase())
                ))
              );

              // Matching projects should be visible
              for (const matchingRepo of matchingRepos) {
                expect(screen.getByTestId(`project-card-${matchingRepo.id}`)).toBeInTheDocument();
              }

              // Non-matching projects should be hidden
              const nonMatchingRepos = apiResponse.repos.filter(repo => !matchingRepos.includes(repo));
              for (const nonMatchingRepo of nonMatchingRepos) {
                expect(screen.queryByTestId(`project-card-${nonMatchingRepo.id}`)).not.toBeInTheDocument();
              }
            });

            // Clear search
            fireEvent.change(searchInput, { target: { value: '' } });
            
            // All projects should be visible again
            await waitFor(() => {
              for (const repo of apiResponse.repos) {
                expect(screen.getByTestId(`project-card-${repo.id}`)).toBeInTheDocument();
              }
            });
          }

          // Property: Language filter should work with current GitHub data
          const languages = Array.from(new Set(apiResponse.repos.map(repo => repo.language)));
          if (languages.length > 1) {
            const testLanguage = languages[0];
            const languageSelect = screen.getByDisplayValue('All Languages');
            
            fireEvent.change(languageSelect, { target: { value: testLanguage } });

            await waitFor(() => {
              const reposWithLanguage = apiResponse.repos.filter(repo => repo.language === testLanguage);
              const reposWithoutLanguage = apiResponse.repos.filter(repo => repo.language !== testLanguage);

              // Projects with selected language should be visible
              for (const repo of reposWithLanguage) {
                expect(screen.getByTestId(`project-card-${repo.id}`)).toBeInTheDocument();
              }

              // Projects with other languages should be hidden
              for (const repo of reposWithoutLanguage) {
                expect(screen.queryByTestId(`project-card-${repo.id}`)).not.toBeInTheDocument();
              }
            });
          }

          // Property: Results count should reflect current filtered data
          const resultsText = screen.getByText(/Showing \d+ of \d+ projects/);
          expect(resultsText).toBeInTheDocument();
          expect(resultsText).toHaveTextContent(`Showing ${apiResponse.repos.length} of ${apiResponse.repos.length} projects`);
        }
      ), { numRuns: 25 });
    }, 30000);

    test('Property 24: Live GitHub Data Updates - projects section handles data refresh correctly', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate initial and updated GitHub data
        fc.record({
          initial: fc.record({
            success: fc.constant(true),
            repos: fc.array(
              fc.record({
                id: fc.integer({ min: 1, max: 100 }),
                name: fc.string({ minLength: 3, maxLength: 15 }).filter(s => s.trim().length >= 3).map(s => s.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 15) || 'initial-repo'),
                description: fc.string({ minLength: 10, maxLength: 60 }).filter(s => s.trim().length >= 10),
                html_url: fc.string({ minLength: 3, maxLength: 12 }).map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
                language: fc.constantFrom('JavaScript', 'Python', 'TypeScript'),
                stargazers_count: fc.integer({ min: 0, max: 50 }),
                updated_at: fc.date({ min: new Date('2023-01-01'), max: new Date('2023-12-31') }).map(d => d.toISOString()),
                topics: fc.array(fc.string({ minLength: 3, maxLength: 8 }).filter(s => s.trim().length >= 3), { minLength: 0, maxLength: 3 }),
                homepage: fc.oneof(fc.webUrl(), fc.constant(null))
              }),
              { minLength: 1, maxLength: 3 }
            ),
            cached: fc.boolean(),
            timestamp: fc.date().map(d => d.toISOString())
          }),
          updated: fc.record({
            success: fc.constant(true),
            repos: fc.array(
              fc.record({
                id: fc.integer({ min: 101, max: 200 }), // Different IDs to simulate new/updated repos
                name: fc.string({ minLength: 3, maxLength: 15 }).filter(s => s.trim().length >= 3).map(s => s.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 15) || 'updated-repo'),
                description: fc.string({ minLength: 10, maxLength: 60 }).filter(s => s.trim().length >= 10),
                html_url: fc.string({ minLength: 3, maxLength: 12 }).map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
                language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java'),
                stargazers_count: fc.integer({ min: 0, max: 100 }),
                updated_at: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map(d => d.toISOString()),
                topics: fc.array(fc.string({ minLength: 3, maxLength: 8 }).filter(s => s.trim().length >= 3), { minLength: 0, maxLength: 4 }),
                homepage: fc.oneof(fc.webUrl(), fc.constant(null))
              }),
              { minLength: 1, maxLength: 4 }
            ),
            cached: fc.constant(false), // Fresh data after refresh
            timestamp: fc.date().map(d => d.toISOString())
          })
        }),
        
        async (testData) => {
          // Mock initial API response
          (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => testData.initial
          });

          // Property: Component should display initial GitHub data
          render(<Projects />);

          // Wait for initial projects to load
          await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
          });

          // Verify initial projects are displayed
          for (const repo of testData.initial.repos) {
            await waitFor(() => {
              expect(screen.getByTestId(`project-card-${repo.id}`)).toBeInTheDocument();
            });
          }

          // Mock refresh API response
          (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => testData.updated
          });

          // Property: Refresh should update to display new GitHub data
          const refreshButton = screen.getByTitle('Refresh GitHub data');
          fireEvent.click(refreshButton);

          // Wait for refresh to complete
          await waitFor(() => {
            // New projects should be displayed
            for (const repo of testData.updated.repos) {
              expect(screen.getByTestId(`project-card-${repo.id}`)).toBeInTheDocument();
            }
          }, { timeout: 3000 });

          // Property: Old projects should no longer be displayed after refresh
          for (const repo of testData.initial.repos) {
            expect(screen.queryByTestId(`project-card-${repo.id}`)).not.toBeInTheDocument();
          }

          // Property: Updated data should be reflected in search and filter functionality
          if (testData.updated.repos.length > 0) {
            const testRepo = testData.updated.repos[0];
            
            // Test search with updated data
            const searchInput = screen.getByPlaceholderText('Search projects...');
            fireEvent.change(searchInput, { target: { value: testRepo.name.substring(0, 3) } });

            await waitFor(() => {
              expect(screen.getByTestId(`project-card-${testRepo.id}`)).toBeInTheDocument();
            });

            // Clear search
            fireEvent.change(searchInput, { target: { value: '' } });

            // Test language filter with updated data
            const languageSelect = screen.getByDisplayValue('All Languages');
            fireEvent.change(languageSelect, { target: { value: testRepo.language } });

            await waitFor(() => {
              const reposWithLanguage = testData.updated.repos.filter(repo => repo.language === testRepo.language);
              for (const repo of reposWithLanguage) {
                expect(screen.getByTestId(`project-card-${repo.id}`)).toBeInTheDocument();
              }
            });
          }

          // Property: Results count should reflect updated data
          const resultsText = screen.getByText(/Showing \d+ of \d+ projects/);
          expect(resultsText).toHaveTextContent(`Showing ${testData.updated.repos.length} of ${testData.updated.repos.length} projects`);
        }
      ), { numRuns: 15 });
    }, 30000);
  });
});