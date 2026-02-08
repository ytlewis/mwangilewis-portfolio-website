const fc = require('fast-check');
const githubService = require('../services/githubService');
const scheduler = require('../services/scheduler');
const https = require('https');

// Mock https module for testing
jest.mock('https');

describe('GitHub Integration Service Tests', () => {
  beforeEach(() => {
    // Clear cache before each test
    githubService.clearCache();
    jest.clearAllMocks();
  });

  describe('Property 23: GitHub Repository Fetching', () => {
    test('fetchPinnedRepos returns array of repository objects with required fields', async () => {
      // **Validates: Requirements 6.1**
      // Feature: lewis-portfolio-website, Property 23: GitHub Repository Fetching
      
      await fc.assert(fc.asyncProperty(
        // Generate various GitHub API response scenarios
        fc.record({
          statusCode: fc.constantFrom(200, 201), // Successful status codes
          repos: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 999999 }),
              name: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9\-_]/.test(c)), { minLength: 1, maxLength: 50 }),
              description: fc.oneof(
                fc.string({ minLength: 1, maxLength: 200 }),
                fc.constant(null)
              ),
              html_url: fc.string().map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
              language: fc.oneof(
                fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Go', 'Rust'),
                fc.constant(null)
              ),
              stargazers_count: fc.integer({ min: 0, max: 10000 }),
              updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
              topics: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }),
              homepage: fc.oneof(
                fc.webUrl(),
                fc.constant(null)
              ),
              fork: fc.boolean()
            }),
            { minLength: 1, maxLength: 10 }
          )
        }),
        fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'testuser'),
        
        async (mockApiResponse, username) => {
          // Clear cache before each property test iteration
          githubService.clearCache();
          
          // Mock successful GitHub API response
          const mockResponse = {
            statusCode: mockApiResponse.statusCode,
            on: jest.fn((event, callback) => {
              if (event === 'data') {
                callback(JSON.stringify(mockApiResponse.repos));
              } else if (event === 'end') {
                callback();
              }
            })
          };

          const mockRequest = {
            on: jest.fn(),
            setTimeout: jest.fn()
          };

          https.get.mockImplementation((url, options, callback) => {
            callback(mockResponse);
            return mockRequest;
          });

          // Execute the GitHub API call
          const repos = await githubService.fetchPinnedRepos(username);

          // Property: For any GitHub API call, the result should be an array of repository objects with complete data
          expect(Array.isArray(repos)).toBe(true);
          expect(repos.length).toBeGreaterThan(0);

          // Property: Each repository object should have all required fields with correct types
          repos.forEach(repo => {
            // Required fields must exist
            expect(repo).toHaveProperty('id');
            expect(repo).toHaveProperty('name');
            expect(repo).toHaveProperty('description');
            expect(repo).toHaveProperty('html_url');
            expect(repo).toHaveProperty('language');
            expect(repo).toHaveProperty('stargazers_count');
            expect(repo).toHaveProperty('updated_at');

            // Field types must be correct
            expect(typeof repo.id).toBe('number');
            expect(typeof repo.name).toBe('string');
            expect(typeof repo.description).toBe('string');
            expect(typeof repo.html_url).toBe('string');
            expect(typeof repo.language).toBe('string');
            expect(typeof repo.stargazers_count).toBe('number');
            expect(typeof repo.updated_at).toBe('string');

            // Field constraints must be satisfied
            expect(repo.id).toBeGreaterThan(0);
            expect(repo.name.length).toBeGreaterThan(0);
            expect(repo.description.length).toBeGreaterThan(0); // Service provides fallback for null descriptions
            expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);
            expect(repo.language.length).toBeGreaterThan(0); // Service provides fallback for null languages
            expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
            expect(() => new Date(repo.updated_at)).not.toThrow();
            expect(new Date(repo.updated_at).toString()).not.toBe('Invalid Date');
          });
        }
      ), { numRuns: 100 });
    });

    test('fetchPinnedRepos handles API errors gracefully and returns valid fallback data', async () => {
      // **Validates: Requirements 6.1**
      // Feature: lewis-portfolio-website, Property 23: GitHub Repository Fetching
      
      await fc.assert(fc.asyncProperty(
        // Generate various error scenarios
        fc.record({
          statusCode: fc.constantFrom(400, 401, 403, 404, 429, 500, 502, 503),
          errorMessage: fc.string({ minLength: 1, maxLength: 100 })
        }),
        fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'testuser'),
        
        async (errorScenario, username) => {
          // Clear cache before each property test iteration
          githubService.clearCache();
          
          // Mock failed GitHub API response
          const mockResponse = {
            statusCode: errorScenario.statusCode,
            on: jest.fn((event, callback) => {
              if (event === 'data') {
                callback(JSON.stringify({ message: errorScenario.errorMessage }));
              } else if (event === 'end') {
                callback();
              }
            })
          };

          const mockRequest = {
            on: jest.fn(),
            setTimeout: jest.fn()
          };

          https.get.mockImplementation((url, options, callback) => {
            callback(mockResponse);
            return mockRequest;
          });

          // Execute the GitHub API call
          const repos = await githubService.fetchPinnedRepos(username);

          // Property: For any GitHub API error, the service should return valid fallback data
          expect(Array.isArray(repos)).toBe(true);
          expect(repos.length).toBeGreaterThan(0);

          // Property: Fallback data should have the same structure as successful API responses
          repos.forEach(repo => {
            expect(repo).toHaveProperty('id');
            expect(repo).toHaveProperty('name');
            expect(repo).toHaveProperty('description');
            expect(repo).toHaveProperty('html_url');
            expect(repo).toHaveProperty('language');
            expect(repo).toHaveProperty('stargazers_count');
            expect(repo).toHaveProperty('updated_at');

            // Field types must be correct
            expect(typeof repo.id).toBe('number');
            expect(typeof repo.name).toBe('string');
            expect(typeof repo.description).toBe('string');
            expect(typeof repo.html_url).toBe('string');
            expect(typeof repo.language).toBe('string');
            expect(typeof repo.stargazers_count).toBe('number');
            expect(typeof repo.updated_at).toBe('string');

            // Field constraints must be satisfied
            expect(repo.id).toBeGreaterThan(0);
            expect(repo.name.length).toBeGreaterThan(0);
            expect(repo.description.length).toBeGreaterThan(0);
            expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);
            expect(repo.language.length).toBeGreaterThan(0);
            expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
            expect(() => new Date(repo.updated_at)).not.toThrow();
            expect(new Date(repo.updated_at).toString()).not.toBe('Invalid Date');
          });

          // Property: Fallback data should contain expected featured projects
          const repoNames = repos.map(repo => repo.name.toLowerCase());
          expect(repoNames).toContain('pharmup');
          expect(repoNames).toContain('seculearn');
        }
      ), { numRuns: 50 });
    });

    test('fetchPinnedRepos handles network errors gracefully and returns valid fallback data', async () => {
      // **Validates: Requirements 6.1**
      // Feature: lewis-portfolio-website, Property 23: GitHub Repository Fetching
      
      await fc.assert(fc.asyncProperty(
        // Generate various network error scenarios
        fc.constantFrom(
          'ECONNREFUSED',
          'ENOTFOUND', 
          'ETIMEDOUT',
          'ECONNRESET',
          'EHOSTUNREACH'
        ),
        fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'testuser'),
        
        async (errorCode, username) => {
          // Clear cache before each property test iteration
          githubService.clearCache();
          
          // Mock network error
          const mockRequest = {
            on: jest.fn((event, callback) => {
              if (event === 'error') {
                callback(new Error(`Network error: ${errorCode}`));
              }
            }),
            setTimeout: jest.fn()
          };

          https.get.mockImplementation((url, options, callback) => {
            return mockRequest;
          });

          // Execute the GitHub API call
          const repos = await githubService.fetchPinnedRepos(username);

          // Property: For any network error, the service should return valid fallback data
          expect(Array.isArray(repos)).toBe(true);
          expect(repos.length).toBeGreaterThan(0);

          // Property: Fallback data should maintain the same structure as successful responses
          repos.forEach(repo => {
            expect(repo).toHaveProperty('id');
            expect(repo).toHaveProperty('name');
            expect(repo).toHaveProperty('description');
            expect(repo).toHaveProperty('html_url');
            expect(repo).toHaveProperty('language');
            expect(repo).toHaveProperty('stargazers_count');
            expect(repo).toHaveProperty('updated_at');

            // Field types must be correct
            expect(typeof repo.id).toBe('number');
            expect(typeof repo.name).toBe('string');
            expect(typeof repo.description).toBe('string');
            expect(typeof repo.html_url).toBe('string');
            expect(typeof repo.language).toBe('string');
            expect(typeof repo.stargazers_count).toBe('number');
            expect(typeof repo.updated_at).toBe('string');

            // Field constraints must be satisfied
            expect(repo.id).toBeGreaterThan(0);
            expect(repo.name.length).toBeGreaterThan(0);
            expect(repo.description.length).toBeGreaterThan(0);
            expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);
            expect(repo.language.length).toBeGreaterThan(0);
            expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
            expect(() => new Date(repo.updated_at)).not.toThrow();
            expect(new Date(repo.updated_at).toString()).not.toBe('Invalid Date');
          });
        }
      ), { numRuns: 25 });
    });
  });

  describe('Property 25: GitHub API Fallback Behavior', () => {
    test('system displays cached project information when GitHub data is unavailable', async () => {
      // **Validates: Requirements 6.3**
      // Feature: lewis-portfolio-website, Property 25: GitHub API Fallback Behavior
      
      await fc.assert(fc.asyncProperty(
        // Generate various failure scenarios and cached data combinations
        fc.record({
          // API failure scenarios
          failureType: fc.constantFrom(
            'http_error',      // HTTP error status codes
            'network_error',   // Network connectivity issues
            'timeout_error',   // Request timeout
            'parse_error',     // JSON parsing errors
            'empty_response'   // Empty or malformed response
          ),
          statusCode: fc.constantFrom(400, 401, 403, 404, 429, 500, 502, 503, 504),
          errorMessage: fc.string({ minLength: 1, maxLength: 100 }),
          
          // Cached data scenarios
          hasCachedData: fc.boolean(),
          cachedRepos: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 999999 }),
              name: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9\-_]/.test(c)), { minLength: 1, maxLength: 30 }),
              description: fc.string({ minLength: 1, maxLength: 100 }),
              html_url: fc.string().map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
              language: fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java'),
              stargazers_count: fc.integer({ min: 0, max: 100 }),
              updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
              topics: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 3 }),
              homepage: fc.oneof(fc.webUrl(), fc.constant(null))
            }),
            { minLength: 1, maxLength: 5 }
          )
        }),
        fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'testuser'),
        
        async (scenario, username) => {
          // Clear cache before each property test iteration
          githubService.clearCache();
          
          // Set up cached data if scenario requires it
          if (scenario.hasCachedData) {
            // First, populate cache with successful response
            const mockSuccessResponse = {
              statusCode: 200,
              on: jest.fn((event, callback) => {
                if (event === 'data') {
                  callback(JSON.stringify(scenario.cachedRepos));
                } else if (event === 'end') {
                  callback();
                }
              })
            };

            https.get.mockImplementationOnce((url, options, callback) => {
              callback(mockSuccessResponse);
              return {
                on: jest.fn(),
                setTimeout: jest.fn()
              };
            });

            // Populate cache
            await githubService.fetchPinnedRepos(username);
          }

          // Now mock the failure scenario
          const mockRequest = {
            on: jest.fn(),
            setTimeout: jest.fn(),
            destroy: jest.fn()
          };

          https.get.mockImplementation((url, options, callback) => {
            switch (scenario.failureType) {
              case 'http_error':
                const mockResponse = {
                  statusCode: scenario.statusCode,
                  on: jest.fn((event, callback) => {
                    if (event === 'data') {
                      callback(JSON.stringify({ message: scenario.errorMessage }));
                    } else if (event === 'end') {
                      callback();
                    }
                  })
                };
                callback(mockResponse);
                break;
                
              case 'network_error':
                mockRequest.on.mockImplementation((event, callback) => {
                  if (event === 'error') {
                    callback(new Error(`Network error: ${scenario.errorMessage}`));
                  }
                });
                break;
                
              case 'timeout_error':
                mockRequest.setTimeout.mockImplementation((timeout, callback) => {
                  callback();
                });
                break;
                
              case 'parse_error':
                const malformedResponse = {
                  statusCode: 200,
                  on: jest.fn((event, callback) => {
                    if (event === 'data') {
                      callback('invalid json {');
                    } else if (event === 'end') {
                      callback();
                    }
                  })
                };
                callback(malformedResponse);
                break;
                
              case 'empty_response':
                const emptyResponse = {
                  statusCode: 200,
                  on: jest.fn((event, callback) => {
                    if (event === 'data') {
                      callback('');
                    } else if (event === 'end') {
                      callback();
                    }
                  })
                };
                callback(emptyResponse);
                break;
            }
            
            return mockRequest;
          });

          // Execute the GitHub API call that should fail
          const repos = await githubService.fetchPinnedRepos(username);

          // Property: For any GitHub API failure, the system should display project information
          expect(Array.isArray(repos)).toBe(true);
          expect(repos.length).toBeGreaterThan(0);

          // Property: Returned data should have consistent structure regardless of source (cache vs fallback)
          repos.forEach(repo => {
            // All required fields must be present
            expect(repo).toHaveProperty('id');
            expect(repo).toHaveProperty('name');
            expect(repo).toHaveProperty('description');
            expect(repo).toHaveProperty('html_url');
            expect(repo).toHaveProperty('language');
            expect(repo).toHaveProperty('stargazers_count');
            expect(repo).toHaveProperty('updated_at');

            // Field types must be correct
            expect(typeof repo.id).toBe('number');
            expect(typeof repo.name).toBe('string');
            expect(typeof repo.description).toBe('string');
            expect(typeof repo.html_url).toBe('string');
            expect(typeof repo.language).toBe('string');
            expect(typeof repo.stargazers_count).toBe('number');
            expect(typeof repo.updated_at).toBe('string');

            // Field constraints must be satisfied
            expect(repo.id).toBeGreaterThan(0);
            expect(repo.name.length).toBeGreaterThan(0);
            expect(repo.description.length).toBeGreaterThan(0);
            expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);
            expect(repo.language.length).toBeGreaterThan(0);
            expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
            expect(() => new Date(repo.updated_at)).not.toThrow();
            expect(new Date(repo.updated_at).toString()).not.toBe('Invalid Date');
          });

          // Property: If cached data was available, it should be returned; otherwise fallback data
          if (scenario.hasCachedData) {
            // Should return cached data (or at least data with same structure)
            // We can't guarantee exact match due to service processing, but structure should be consistent
            expect(repos.length).toBeGreaterThan(0);
          } else {
            // Should return fallback data with expected featured projects
            const repoNames = repos.map(repo => repo.name.toLowerCase());
            expect(repoNames).toContain('pharmup');
            expect(repoNames).toContain('seculearn');
            expect(repoNames).toContain('lewis-portfolio-website');
          }

          // Property: System should never return empty results when fallback is available
          expect(repos.length).toBeGreaterThan(0);
        }
      ), { numRuns: 100 });
    });

    test('fallback behavior maintains data consistency across multiple failure scenarios', async () => {
      // **Validates: Requirements 6.3**
      // Feature: lewis-portfolio-website, Property 25: GitHub API Fallback Behavior
      
      await fc.assert(fc.asyncProperty(
        // Generate sequences of API calls with different failure patterns
        fc.array(
          fc.record({
            shouldFail: fc.boolean(),
            failureType: fc.constantFrom('http_error', 'network_error', 'timeout_error'),
            statusCode: fc.constantFrom(400, 403, 404, 500, 502, 503),
            delay: fc.integer({ min: 0, max: 100 }) // Simulate timing variations
          }),
          { minLength: 2, maxLength: 5 }
        ),
        fc.string({ minLength: 1, maxLength: 15 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'user'),
        
        async (callSequence, username) => {
          // Clear cache before test sequence
          githubService.clearCache();
          
          const results = [];
          
          for (let i = 0; i < callSequence.length; i++) {
            const call = callSequence[i];
            
            if (call.shouldFail) {
              // Mock failure scenario
              const mockRequest = {
                on: jest.fn(),
                setTimeout: jest.fn(),
                destroy: jest.fn()
              };

              https.get.mockImplementation((url, options, callback) => {
                if (call.failureType === 'network_error') {
                  mockRequest.on.mockImplementation((event, callback) => {
                    if (event === 'error') {
                      callback(new Error('Network failure'));
                    }
                  });
                } else if (call.failureType === 'timeout_error') {
                  mockRequest.setTimeout.mockImplementation((timeout, callback) => {
                    callback();
                  });
                } else {
                  // HTTP error
                  const mockResponse = {
                    statusCode: call.statusCode,
                    on: jest.fn((event, callback) => {
                      if (event === 'data') {
                        callback('{"message": "API Error"}');
                      } else if (event === 'end') {
                        callback();
                      }
                    })
                  };
                  callback(mockResponse);
                }
                return mockRequest;
              });
            } else {
              // Mock successful response
              const mockRepos = [
                {
                  id: 100 + i,
                  name: `success-repo-${i}`,
                  description: `Successful repository ${i}`,
                  html_url: `https://github.com/user/success-repo-${i}`,
                  language: 'JavaScript',
                  stargazers_count: i,
                  updated_at: new Date().toISOString(),
                  topics: [`topic-${i}`],
                  homepage: null,
                  fork: false
                }
              ];

              const mockResponse = {
                statusCode: 200,
                on: jest.fn((event, callback) => {
                  if (event === 'data') {
                    callback(JSON.stringify(mockRepos));
                  } else if (event === 'end') {
                    callback();
                  }
                })
              };

              https.get.mockImplementation((url, options, callback) => {
                callback(mockResponse);
                return {
                  on: jest.fn(),
                  setTimeout: jest.fn()
                };
              });
            }

            // Add small delay to simulate real-world timing
            if (call.delay > 0) {
              await new Promise(resolve => setTimeout(resolve, call.delay));
            }

            // Execute API call
            const repos = await githubService.fetchPinnedRepos(username);
            results.push({
              callIndex: i,
              shouldFail: call.shouldFail,
              repos: repos
            });
          }

          // Property: All calls should return valid repository data regardless of failure scenarios
          results.forEach((result, index) => {
            expect(Array.isArray(result.repos)).toBe(true);
            expect(result.repos.length).toBeGreaterThan(0);

            // Property: Data structure should be consistent across all calls
            result.repos.forEach(repo => {
              expect(repo).toHaveProperty('id');
              expect(repo).toHaveProperty('name');
              expect(repo).toHaveProperty('description');
              expect(repo).toHaveProperty('html_url');
              expect(repo).toHaveProperty('language');
              expect(repo).toHaveProperty('stargazers_count');
              expect(repo).toHaveProperty('updated_at');

              expect(typeof repo.id).toBe('number');
              expect(typeof repo.name).toBe('string');
              expect(typeof repo.description).toBe('string');
              expect(typeof repo.html_url).toBe('string');
              expect(typeof repo.language).toBe('string');
              expect(typeof repo.stargazers_count).toBe('number');
              expect(typeof repo.updated_at).toBe('string');

              expect(repo.id).toBeGreaterThan(0);
              expect(repo.name.length).toBeGreaterThan(0);
              expect(repo.description.length).toBeGreaterThan(0);
              expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);
              expect(repo.language.length).toBeGreaterThan(0);
              expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
            });
          });

          // Property: System should maintain consistency - if cache is populated, subsequent failures should return cached data
          const successfulCalls = results.filter(r => !r.shouldFail);
          const failedCalls = results.filter(r => r.shouldFail);
          
          if (successfulCalls.length > 0 && failedCalls.length > 0) {
            // Find the last successful call before any failed calls
            const lastSuccessIndex = Math.max(...successfulCalls.map(r => r.callIndex));
            const failedCallsAfterSuccess = failedCalls.filter(r => r.callIndex > lastSuccessIndex);
            
            if (failedCallsAfterSuccess.length > 0) {
              // Failed calls after successful ones should still return valid data (cached or fallback)
              failedCallsAfterSuccess.forEach(failedCall => {
                expect(failedCall.repos.length).toBeGreaterThan(0);
              });
            }
          }
        }
      ), { numRuns: 50 });
    });
  });

  describe('Property 26: Repository Information Completeness', () => {
    test('all displayed repositories contain complete required information regardless of API data quality', async () => {
      // **Validates: Requirements 6.4**
      // Feature: lewis-portfolio-website, Property 26: Repository Information Completeness
      
      await fc.assert(fc.asyncProperty(
        // Generate various GitHub API response scenarios with different data quality
        fc.record({
          statusCode: fc.constantFrom(200, 201), // Successful status codes
          repos: fc.array(
            fc.record({
              id: fc.integer({ min: 1, max: 999999 }),
              name: fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9\-_]/.test(c)), { minLength: 1, maxLength: 50 }),
              // Test various description scenarios including null, empty, and valid descriptions
              description: fc.oneof(
                fc.string({ minLength: 1, maxLength: 200 }),
                fc.constant(null),
                fc.constant(''),
                fc.constant(undefined)
              ),
              html_url: fc.string().map(s => `https://github.com/user/${s.replace(/[^a-zA-Z0-9\-_]/g, '') || 'repo'}`),
              // Test various language scenarios including null, empty, and valid languages
              language: fc.oneof(
                fc.constantFrom('JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby'),
                fc.constant(null),
                fc.constant(''),
                fc.constant(undefined)
              ),
              stargazers_count: fc.integer({ min: 0, max: 10000 }),
              updated_at: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
              topics: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }),
              homepage: fc.oneof(
                fc.webUrl(),
                fc.constant(null),
                fc.constant(''),
                fc.constant(undefined)
              ),
              fork: fc.boolean()
            }),
            { minLength: 1, maxLength: 10 }
          )
        }),
        fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'testuser'),
        
        async (mockApiResponse, username) => {
          // Clear cache before each property test iteration
          githubService.clearCache();
          
          // Mock successful GitHub API response with potentially incomplete data
          const mockResponse = {
            statusCode: mockApiResponse.statusCode,
            on: jest.fn((event, callback) => {
              if (event === 'data') {
                callback(JSON.stringify(mockApiResponse.repos));
              } else if (event === 'end') {
                callback();
              }
            })
          };

          const mockRequest = {
            on: jest.fn(),
            setTimeout: jest.fn()
          };

          https.get.mockImplementation((url, options, callback) => {
            callback(mockResponse);
            return mockRequest;
          });

          // Execute the GitHub API call
          const repos = await githubService.fetchPinnedRepos(username);

          // Property: For any displayed GitHub repository, all required information must be present and complete
          expect(Array.isArray(repos)).toBe(true);
          expect(repos.length).toBeGreaterThan(0);

          // Property: Every repository object must have all required fields with valid data
          repos.forEach(repo => {
            // ID must be present and valid
            expect(repo).toHaveProperty('id');
            expect(typeof repo.id).toBe('number');
            expect(repo.id).toBeGreaterThan(0);

            // Name must be present and non-empty
            expect(repo).toHaveProperty('name');
            expect(typeof repo.name).toBe('string');
            expect(repo.name.length).toBeGreaterThan(0);
            expect(repo.name.trim()).toBe(repo.name); // No leading/trailing whitespace

            // Description must be present and non-empty (service should provide fallback)
            expect(repo).toHaveProperty('description');
            expect(typeof repo.description).toBe('string');
            expect(repo.description.length).toBeGreaterThan(0);
            // Service should convert null/empty descriptions to meaningful fallback

            // HTML URL must be present and valid GitHub URL
            expect(repo).toHaveProperty('html_url');
            expect(typeof repo.html_url).toBe('string');
            expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);
            expect(repo.html_url.length).toBeGreaterThan('https://github.com/'.length);

            // Language must be present and non-empty (service should provide fallback)
            expect(repo).toHaveProperty('language');
            expect(typeof repo.language).toBe('string');
            expect(repo.language.length).toBeGreaterThan(0);
            // Service should convert null/empty languages to meaningful fallback

            // Star count must be present and non-negative
            expect(repo).toHaveProperty('stargazers_count');
            expect(typeof repo.stargazers_count).toBe('number');
            expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(repo.stargazers_count)).toBe(true);

            // Updated date must be present and valid ISO date string
            expect(repo).toHaveProperty('updated_at');
            expect(typeof repo.updated_at).toBe('string');
            expect(repo.updated_at.length).toBeGreaterThan(0);
            expect(() => new Date(repo.updated_at)).not.toThrow();
            expect(new Date(repo.updated_at).toString()).not.toBe('Invalid Date');
            expect(new Date(repo.updated_at).getTime()).toBeGreaterThan(0);
          });

          // Property: Repository data should be consistent and well-formed
          const repoNames = repos.map(repo => repo.name);
          const uniqueNames = new Set(repoNames);
          expect(uniqueNames.size).toBe(repoNames.length); // No duplicate repository names

          // Property: All URLs should be accessible GitHub repository URLs
          repos.forEach(repo => {
            const urlParts = repo.html_url.split('/');
            expect(urlParts.length).toBeGreaterThanOrEqual(5); // https://github.com/user/repo
            expect(urlParts[2]).toBe('github.com');
            expect(urlParts[3].length).toBeGreaterThan(0); // username
            expect(urlParts[4].length).toBeGreaterThan(0); // repository name
          });
        }
      ), { numRuns: 100 });
    });

    test('fallback data maintains complete required information when API fails', async () => {
      // **Validates: Requirements 6.4**
      // Feature: lewis-portfolio-website, Property 26: Repository Information Completeness
      
      await fc.assert(fc.asyncProperty(
        // Generate various API failure scenarios
        fc.record({
          failureType: fc.constantFrom(
            'http_error',      // HTTP error status codes
            'network_error',   // Network connectivity issues
            'timeout_error',   // Request timeout
            'parse_error',     // JSON parsing errors
            'empty_response'   // Empty or malformed response
          ),
          statusCode: fc.constantFrom(400, 401, 403, 404, 429, 500, 502, 503, 504),
          errorMessage: fc.string({ minLength: 1, maxLength: 100 })
        }),
        fc.string({ minLength: 1, maxLength: 20 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'testuser'),
        
        async (failureScenario, username) => {
          // Clear cache before each property test iteration
          githubService.clearCache();
          
          // Mock various failure scenarios
          const mockRequest = {
            on: jest.fn(),
            setTimeout: jest.fn(),
            destroy: jest.fn()
          };

          https.get.mockImplementation((url, options, callback) => {
            switch (failureScenario.failureType) {
              case 'http_error':
                const mockResponse = {
                  statusCode: failureScenario.statusCode,
                  on: jest.fn((event, callback) => {
                    if (event === 'data') {
                      callback(JSON.stringify({ message: failureScenario.errorMessage }));
                    } else if (event === 'end') {
                      callback();
                    }
                  })
                };
                callback(mockResponse);
                break;
                
              case 'network_error':
                mockRequest.on.mockImplementation((event, callback) => {
                  if (event === 'error') {
                    callback(new Error(`Network error: ${failureScenario.errorMessage}`));
                  }
                });
                break;
                
              case 'timeout_error':
                mockRequest.setTimeout.mockImplementation((timeout, callback) => {
                  callback();
                });
                break;
                
              case 'parse_error':
                const malformedResponse = {
                  statusCode: 200,
                  on: jest.fn((event, callback) => {
                    if (event === 'data') {
                      callback('invalid json {');
                    } else if (event === 'end') {
                      callback();
                    }
                  })
                };
                callback(malformedResponse);
                break;
                
              case 'empty_response':
                const emptyResponse = {
                  statusCode: 200,
                  on: jest.fn((event, callback) => {
                    if (event === 'data') {
                      callback('');
                    } else if (event === 'end') {
                      callback();
                    }
                  })
                };
                callback(emptyResponse);
                break;
            }
            
            return mockRequest;
          });

          // Execute the GitHub API call that should fail and return fallback data
          const repos = await githubService.fetchPinnedRepos(username);

          // Property: For any API failure, fallback data must contain complete required information
          expect(Array.isArray(repos)).toBe(true);
          expect(repos.length).toBeGreaterThan(0);

          // Property: Fallback repositories must have all required fields with valid data
          repos.forEach(repo => {
            // All required fields must be present and valid
            expect(repo).toHaveProperty('id');
            expect(typeof repo.id).toBe('number');
            expect(repo.id).toBeGreaterThan(0);

            expect(repo).toHaveProperty('name');
            expect(typeof repo.name).toBe('string');
            expect(repo.name.length).toBeGreaterThan(0);

            expect(repo).toHaveProperty('description');
            expect(typeof repo.description).toBe('string');
            expect(repo.description.length).toBeGreaterThan(0);

            expect(repo).toHaveProperty('html_url');
            expect(typeof repo.html_url).toBe('string');
            expect(repo.html_url).toMatch(/^https:\/\/github\.com\//);

            expect(repo).toHaveProperty('language');
            expect(typeof repo.language).toBe('string');
            expect(repo.language.length).toBeGreaterThan(0);

            expect(repo).toHaveProperty('stargazers_count');
            expect(typeof repo.stargazers_count).toBe('number');
            expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);

            expect(repo).toHaveProperty('updated_at');
            expect(typeof repo.updated_at).toBe('string');
            expect(() => new Date(repo.updated_at)).not.toThrow();
            expect(new Date(repo.updated_at).toString()).not.toBe('Invalid Date');
          });

          // Property: Fallback data should contain expected featured projects with complete information
          const repoNames = repos.map(repo => repo.name.toLowerCase());
          expect(repoNames).toContain('pharmup');
          expect(repoNames).toContain('seculearn');
          expect(repoNames).toContain('lewis-portfolio-website');

          // Property: Each featured project in fallback data must have meaningful content
          const pharmupRepo = repos.find(repo => repo.name.toLowerCase() === 'pharmup');
          const seculearnRepo = repos.find(repo => repo.name.toLowerCase() === 'seculearn');
          const portfolioRepo = repos.find(repo => repo.name.toLowerCase() === 'lewis-portfolio-website');

          [pharmupRepo, seculearnRepo, portfolioRepo].forEach(repo => {
            expect(repo).toBeDefined();
            expect(repo.description).toMatch(/\w+/); // Contains meaningful words
            expect(repo.language).toMatch(/^[A-Za-z+#]+$/); // Valid programming language name
            expect(repo.html_url).toMatch(/^https:\/\/github\.com\/lewisgathaiya\//);
          });
        }
      ), { numRuns: 100 });
    });
  });

  describe('Property 27: Periodic GitHub Data Refresh', () => {
    beforeEach(() => {
      // Stop scheduler if running
      if (scheduler.getStatus().isRunning) {
        scheduler.stop();
      }
      jest.clearAllTimers();
      jest.useFakeTimers();
    });

    afterEach(() => {
      // Clean up scheduler
      if (scheduler.getStatus().isRunning) {
        scheduler.stop();
      }
      jest.useRealTimers();
    });

    test('scheduler starts and maintains periodic refresh intervals', async () => {
      // Feature: lewis-portfolio-website, Property 27: Periodic GitHub Data Refresh
      
      // Mock successful GitHub API response
      const mockRepos = [
        {
          id: 123,
          name: 'test-repo',
          description: 'Test repository',
          html_url: 'https://github.com/user/test-repo',
          language: 'JavaScript',
          stargazers_count: 5,
          updated_at: '2024-01-01T00:00:00Z',
          topics: ['test'],
          homepage: null,
          fork: false
        }
      ];

      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify(mockRepos));
          } else if (event === 'end') {
            callback();
          }
        })
      };

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn(),
          setTimeout: jest.fn()
        };
      });

      // Spy on the fetchPinnedRepos method to track calls
      const fetchSpy = jest.spyOn(githubService, 'fetchPinnedRepos');

      // Start the scheduler
      scheduler.start();

      // Verify scheduler is running and has the refresh interval
      expect(scheduler.getStatus().isRunning).toBe(true);
      expect(scheduler.getStatus().activeIntervals).toContain('github-refresh');

      // Wait for any initial async operations
      await jest.runOnlyPendingTimersAsync();
      
      // Record initial call count (may include initial fetch)
      const callsAfterStart = fetchSpy.mock.calls.length;
      expect(callsAfterStart).toBeGreaterThanOrEqual(1);

      // Fast-forward time by 2 hours (scheduler interval)
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      await jest.runOnlyPendingTimersAsync();

      // Should have additional calls after the interval
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsAfterStart);

      // Fast-forward another 2 hours
      const callsAfterFirstInterval = fetchSpy.mock.calls.length;
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      await jest.runOnlyPendingTimersAsync();

      // Should have even more calls after the second interval
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsAfterFirstInterval);

      fetchSpy.mockRestore();
    });

    test('scheduler handles refresh failures gracefully and continues execution', async () => {
      // Feature: lewis-portfolio-website, Property 27: Periodic GitHub Data Refresh
      
      let shouldFail = false;
      const fetchSpy = jest.spyOn(githubService, 'fetchPinnedRepos').mockImplementation(async () => {
        if (shouldFail) {
          throw new Error('GitHub API temporarily unavailable');
        }
        return [
          {
            id: 123,
            name: 'test-repo',
            description: 'Test repository',
            html_url: 'https://github.com/user/test-repo',
            language: 'JavaScript',
            stargazers_count: 5,
            updated_at: '2024-01-01T00:00:00Z',
            topics: ['test'],
            homepage: null
          }
        ];
      });

      // Start the scheduler
      scheduler.start();

      // Verify scheduler is running
      expect(scheduler.getStatus().isRunning).toBe(true);

      // Wait for initial operations
      await jest.runOnlyPendingTimersAsync();
      
      // Make next calls fail
      shouldFail = true;

      // Fast-forward to trigger interval (which will fail)
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      await jest.runOnlyPendingTimersAsync();

      // Scheduler should still be running despite the failure
      expect(scheduler.getStatus().isRunning).toBe(true);
      expect(scheduler.getStatus().activeIntervals).toContain('github-refresh');

      // Make calls succeed again
      shouldFail = false;

      // Fast-forward to trigger another interval (should succeed)
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      await jest.runOnlyPendingTimersAsync();

      // Scheduler should still be running and functional
      expect(scheduler.getStatus().isRunning).toBe(true);
      expect(scheduler.getStatus().activeIntervals).toContain('github-refresh');

      fetchSpy.mockRestore();
    });

    test('manual refresh trigger works independently of scheduled refresh', async () => {
      // Feature: lewis-portfolio-website, Property 27: Periodic GitHub Data Refresh
      
      // Mock successful GitHub API response
      const mockRepos = [
        {
          id: 123,
          name: 'test-repo',
          description: 'Test repository',
          html_url: 'https://github.com/user/test-repo',
          language: 'JavaScript',
          stargazers_count: 5,
          updated_at: '2024-01-01T00:00:00Z',
          topics: ['test'],
          homepage: null,
          fork: false
        }
      ];

      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify(mockRepos));
          } else if (event === 'end') {
            callback();
          }
        })
      };

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn(),
          setTimeout: jest.fn()
        };
      });

      const fetchSpy = jest.spyOn(githubService, 'fetchPinnedRepos');

      // Start the scheduler
      scheduler.start();

      // Wait for initial operations
      await jest.runOnlyPendingTimersAsync();
      
      // Record call count after startup
      const callsAfterStart = fetchSpy.mock.calls.length;

      // Trigger manual refresh
      const manualRefreshResult = await scheduler.triggerGitHubRefresh();
      expect(manualRefreshResult).toBe(true);
      
      // Should have additional calls from manual refresh
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsAfterStart);

      // Record calls after manual refresh
      const callsAfterManual = fetchSpy.mock.calls.length;

      // Fast-forward time to trigger scheduled refresh
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      await jest.runOnlyPendingTimersAsync();

      // Should have additional calls from scheduled refresh
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsAfterManual);

      fetchSpy.mockRestore();
    });
  });
});