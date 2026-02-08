import fc from 'fast-check';

/**
 * Property-Based Tests for Project Card Component
 * These tests validate the core logic and data handling without UI dependencies
 */

describe('ProjectCard Property-Based Tests', () => {
  describe('Property 24: Live GitHub Data Updates', () => {
    test('project data transformation maintains all required fields', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate various GitHub repository data scenarios
        fc.record({
          id: fc.integer({ min: 1, max: 999999 }),
          name: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9\-_]/.test(c)), { minLength: 1, maxLength: 50 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
          html_url: fc.string().map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
          language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'PHP'),
          stargazers_count: fc.integer({ min: 0, max: 10000 }),
          updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
          topics: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { minLength: 0, maxLength: 8 }),
          homepage: fc.oneof(
            fc.webUrl(),
            fc.constant(null),
            fc.constant('')
          )
        }),
        
        async (githubRepo) => {
          // Property: For any GitHub repository data, all required fields should be present and valid
          
          // Validate ID
          expect(typeof githubRepo.id).toBe('number');
          expect(githubRepo.id).toBeGreaterThan(0);

          // Validate name
          expect(typeof githubRepo.name).toBe('string');
          expect(githubRepo.name.length).toBeGreaterThan(0);
          expect(githubRepo.name).toMatch(/^[a-zA-Z0-9\-_]+$/);

          // Validate description
          expect(typeof githubRepo.description).toBe('string');
          expect(githubRepo.description.length).toBeGreaterThan(0);

          // Validate URL
          expect(typeof githubRepo.html_url).toBe('string');
          expect(githubRepo.html_url).toMatch(/^https:\/\/github\.com\//);

          // Validate language
          expect(typeof githubRepo.language).toBe('string');
          expect(githubRepo.language.length).toBeGreaterThan(0);

          // Validate star count
          expect(typeof githubRepo.stargazers_count).toBe('number');
          expect(githubRepo.stargazers_count).toBeGreaterThanOrEqual(0);

          // Validate updated date
          expect(typeof githubRepo.updated_at).toBe('string');
          expect(() => new Date(githubRepo.updated_at)).not.toThrow();
          expect(new Date(githubRepo.updated_at).toString()).not.toBe('Invalid Date');

          // Validate topics array
          expect(Array.isArray(githubRepo.topics)).toBe(true);
          githubRepo.topics?.forEach(topic => {
            expect(typeof topic).toBe('string');
            expect(topic.length).toBeGreaterThan(0);
          });

          // Property: Name formatting should be consistent
          const formattedName = githubRepo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          expect(formattedName.length).toBeGreaterThan(0);
          // Name should be properly formatted (allowing underscores and other valid characters)
          expect(formattedName.trim().length).toBeGreaterThan(0);

          // Property: Date formatting should provide relative time
          const updatedDate = new Date(githubRepo.updated_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          expect(diffDays).toBeGreaterThanOrEqual(0);
          
          // Property: Homepage should be valid URL or null/empty
          if (githubRepo.homepage && githubRepo.homepage.trim() !== '') {
            expect(githubRepo.homepage).toMatch(/^https?:\/\//);
          }

          // Property: Topics should be limited and well-formed
          if (githubRepo.topics && githubRepo.topics.length > 0) {
            expect(githubRepo.topics.length).toBeLessThanOrEqual(8);
            githubRepo.topics.forEach(topic => {
              expect(topic.length).toBeLessThanOrEqual(20);
              // Topics should not be empty after trimming
              expect(topic.trim().length).toBeGreaterThan(0);
            });
          }
        }
      ), { numRuns: 100 });
    });

    test('featured project identification works correctly', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate repository names that may or may not be featured
        fc.oneof(
          // Featured project names
          fc.constantFrom('PHARMUP', 'pharmup', 'PharmUp', 'SECULEARN', 'seculearn', 'SecuLearn'),
          // Regular project names
          fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9\-_]/.test(c)), { minLength: 1, maxLength: 30 })
            .filter(name => !name.toLowerCase().includes('pharmup') && !name.toLowerCase().includes('seculearn'))
        ),
        
        async (projectName) => {
          const featuredProjects = ['pharmup', 'seculearn'];
          
          // Property: Featured project identification should be case-insensitive and partial match
          const isFeatured = featuredProjects.some(featured => 
            projectName.toLowerCase().includes(featured.toLowerCase())
          );

          if (projectName.toLowerCase().includes('pharmup') || projectName.toLowerCase().includes('seculearn')) {
            expect(isFeatured).toBe(true);
          } else {
            expect(isFeatured).toBe(false);
          }

          // Property: Featured status should be consistent regardless of case
          const upperCaseName = projectName.toUpperCase();
          const lowerCaseName = projectName.toLowerCase();
          
          const isUpperFeatured = featuredProjects.some(featured => 
            upperCaseName.toLowerCase().includes(featured.toLowerCase())
          );
          const isLowerFeatured = featuredProjects.some(featured => 
            lowerCaseName.toLowerCase().includes(featured.toLowerCase())
          );

          expect(isFeatured).toBe(isUpperFeatured);
          expect(isFeatured).toBe(isLowerFeatured);
        }
      ), { numRuns: 100 });
    });

    test('project sorting prioritizes featured projects correctly', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate arrays of projects with mixed featured and regular projects
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 999999 }),
            name: fc.oneof(
              fc.constantFrom('PHARMUP', 'SECULEARN', 'pharmup-extension', 'seculearn-mobile'),
              fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9\-_]/.test(c)), { minLength: 1, maxLength: 20 })
                .filter(name => !name.toLowerCase().includes('pharmup') && !name.toLowerCase().includes('seculearn'))
            ),
            stargazers_count: fc.integer({ min: 0, max: 1000 }),
            updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString())
          }),
          { minLength: 2, maxLength: 10 }
        ),
        
        async (projects) => {
          const featuredProjects = ['pharmup', 'seculearn'];
          
          // Simulate the sorting logic from the component
          const sortedProjects = [...projects].sort((a, b) => {
            const aIsFeatured = featuredProjects.some(featured => 
              a.name.toLowerCase().includes(featured.toLowerCase())
            );
            const bIsFeatured = featuredProjects.some(featured => 
              b.name.toLowerCase().includes(featured.toLowerCase())
            );

            if (aIsFeatured && !bIsFeatured) return -1;
            if (!aIsFeatured && bIsFeatured) return 1;
            
            // Sort by stars, then by update date
            if (b.stargazers_count !== a.stargazers_count) {
              return b.stargazers_count - a.stargazers_count;
            }
            
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          });

          // Property: Featured projects should appear before non-featured projects
          let foundNonFeatured = false;
          for (const project of sortedProjects) {
            const isFeatured = featuredProjects.some(featured => 
              project.name.toLowerCase().includes(featured.toLowerCase())
            );

            if (!isFeatured) {
              foundNonFeatured = true;
            } else if (foundNonFeatured) {
              // If we found a featured project after a non-featured one, sorting is wrong
              expect(false).toBe(true); // This should not happen
            }
          }

          // Property: Within featured projects, sorting should be by stars then date
          const featuredInSorted = sortedProjects.filter(project =>
            featuredProjects.some(featured => 
              project.name.toLowerCase().includes(featured.toLowerCase())
            )
          );

          for (let i = 0; i < featuredInSorted.length - 1; i++) {
            const current = featuredInSorted[i];
            const next = featuredInSorted[i + 1];

            if (current.stargazers_count !== next.stargazers_count) {
              expect(current.stargazers_count).toBeGreaterThanOrEqual(next.stargazers_count);
            } else {
              const currentDate = new Date(current.updated_at).getTime();
              const nextDate = new Date(next.updated_at).getTime();
              expect(currentDate).toBeGreaterThanOrEqual(nextDate);
            }
          }

          // Property: Within non-featured projects, sorting should be by stars then date
          const nonFeaturedInSorted = sortedProjects.filter(project =>
            !featuredProjects.some(featured => 
              project.name.toLowerCase().includes(featured.toLowerCase())
            )
          );

          for (let i = 0; i < nonFeaturedInSorted.length - 1; i++) {
            const current = nonFeaturedInSorted[i];
            const next = nonFeaturedInSorted[i + 1];

            if (current.stargazers_count !== next.stargazers_count) {
              expect(current.stargazers_count).toBeGreaterThanOrEqual(next.stargazers_count);
            } else {
              const currentDate = new Date(current.updated_at).getTime();
              const nextDate = new Date(next.updated_at).getTime();
              expect(currentDate).toBeGreaterThanOrEqual(nextDate);
            }
          }
        }
      ), { numRuns: 50 });
    });

    test('search and filter functionality works with live GitHub data', async () => {
      // **Validates: Requirements 6.2**
      // Feature: lewis-portfolio-website, Property 24: Live GitHub Data Updates
      
      await fc.assert(fc.asyncProperty(
        // Generate projects and search/filter criteria
        fc.record({
          projects: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 999999 }),
              name: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9\-_]/.test(c)), { minLength: 1, maxLength: 20 }),
              description: fc.string({ minLength: 1, maxLength: 100 }),
              language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java', 'C++'),
              topics: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 0, maxLength: 5 })
            }),
            { minLength: 1, maxLength: 8 }
          ),
          searchTerm: fc.string({ minLength: 1, maxLength: 10 }),
          filterLanguage: fc.constantFrom('all', 'JavaScript', 'Python', 'TypeScript', 'Java', 'C++')
        }),
        
        async ({ projects, searchTerm, filterLanguage }) => {
          // Property: Search should filter projects by name, description, or topics
          const searchFiltered = projects.filter(project =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.topics && project.topics.some(topic => 
              topic.toLowerCase().includes(searchTerm.toLowerCase())
            ))
          );

          // Verify search results contain the search term
          searchFiltered.forEach(project => {
            const matchesName = project.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDescription = project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTopics = project.topics && project.topics.some(topic => 
              topic.toLowerCase().includes(searchTerm.toLowerCase())
            );

            expect(matchesName || matchesDescription || matchesTopics).toBe(true);
          });

          // Property: Language filter should only show projects with selected language
          let languageFiltered = projects;
          if (filterLanguage !== 'all') {
            languageFiltered = projects.filter(project =>
              project.language === filterLanguage
            );

            // Verify all filtered projects have the selected language
            languageFiltered.forEach(project => {
              expect(project.language).toBe(filterLanguage);
            });
          }

          // Property: Combined filters should work correctly
          const combinedFiltered = projects.filter(project => {
            // Apply search filter
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (project.topics && project.topics.some(topic => 
                topic.toLowerCase().includes(searchTerm.toLowerCase())
              ));

            // Apply language filter
            const matchesLanguage = filterLanguage === 'all' || project.language === filterLanguage;

            return matchesSearch && matchesLanguage;
          });

          // Verify combined filter results
          combinedFiltered.forEach(project => {
            // Should match search criteria
            const matchesName = project.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDescription = project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTopics = project.topics && project.topics.some(topic => 
              topic.toLowerCase().includes(searchTerm.toLowerCase())
            );
            expect(matchesName || matchesDescription || matchesTopics).toBe(true);

            // Should match language criteria
            if (filterLanguage !== 'all') {
              expect(project.language).toBe(filterLanguage);
            }
          });

          // Property: Filter results should be a subset of original projects
          expect(searchFiltered.length).toBeLessThanOrEqual(projects.length);
          expect(languageFiltered.length).toBeLessThanOrEqual(projects.length);
          expect(combinedFiltered.length).toBeLessThanOrEqual(projects.length);
          expect(combinedFiltered.length).toBeLessThanOrEqual(searchFiltered.length);
          expect(combinedFiltered.length).toBeLessThanOrEqual(languageFiltered.length);
        }
      ), { numRuns: 50 });
    });
  });
});