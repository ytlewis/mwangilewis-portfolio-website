const https = require('https');

/**
 * GitHub API Service for fetching repository data
 * Implements caching and fallback mechanisms for reliable data access
 */
class GitHubService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes cache timeout
    this.apiBaseUrl = 'https://api.github.com';
    this.username = process.env.GITHUB_USERNAME || 'mwangilewis'; // Lewis's GitHub username
    this.fallbackData = this.getFallbackData();
  }

  /**
   * Fetch pinned repositories from GitHub API
   * @param {string} username - GitHub username (optional, defaults to Lewis's username)
   * @returns {Promise<Array>} Array of repository objects
   */
  async fetchPinnedRepos(username = this.username) {
    const cacheKey = `pinned_repos_${username}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      console.log('Returning cached GitHub data');
      return this.cache.get(cacheKey).data;
    }

    try {
      // Fetch user's repositories
      const repos = await this.fetchUserRepos(username);
      
      // Filter for pinned repositories (GitHub API doesn't directly provide pinned repos)
      // We'll use a combination of factors: recent activity, stars, and featured projects
      const pinnedRepos = this.selectPinnedRepos(repos);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: pinnedRepos,
        timestamp: Date.now()
      });

      console.log(`Fetched ${pinnedRepos.length} pinned repositories from GitHub API`);
      return pinnedRepos;
    } catch (error) {
      console.error('GitHub API error:', error.message);
      
      // Return cached data if available, otherwise fallback data
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        console.log('Returning stale cached data due to API error');
        return cachedData.data;
      }
      
      console.log('Returning fallback data due to API error');
      return this.fallbackData;
    }
  }

  /**
   * Fetch user's repositories from GitHub API
   * @param {string} username - GitHub username
   * @returns {Promise<Array>} Array of repository objects
   */
  async fetchUserRepos(username) {
    const url = `${this.apiBaseUrl}/users/${username}/repos?sort=updated&per_page=100`;
    
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'User-Agent': 'Lewis-Portfolio-Website',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      // Add GitHub token if available for higher rate limits
      if (process.env.GITHUB_TOKEN) {
        options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      const req = https.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const repos = JSON.parse(data);
              resolve(repos);
            } else {
              reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse GitHub API response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`GitHub API request failed: ${error.message}`));
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('GitHub API request timeout'));
      });
    });
  }

  /**
   * Select pinned repositories based on various criteria
   * @param {Array} repos - Array of all repositories
   * @returns {Array} Array of selected pinned repositories
   */
  selectPinnedRepos(repos) {
    // If no repos provided, return fallback data
    if (!repos || repos.length === 0) {
      return this.fallbackData;
    }

    // Filter out forks and focus on original repositories
    const originalRepos = repos.filter(repo => !repo.fork);
    
    // Define featured project names (case-insensitive)
    const featuredProjects = ['pharmup', 'seculearn'];
    
    // Separate featured projects and other repos
    const featured = originalRepos.filter(repo => 
      featuredProjects.some(featured => 
        repo.name.toLowerCase().includes(featured.toLowerCase())
      )
    );
    
    // Get other notable repositories (with stars, recent activity, or good description)
    const others = originalRepos
      .filter(repo => !featured.includes(repo))
      .filter(repo => 
        repo.stargazers_count > 0 || 
        repo.description || 
        new Date(repo.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Updated in last 90 days
      )
      .sort((a, b) => {
        // Sort by stars, then by recent activity
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

    // Combine featured projects with top other repositories (limit to 6 total)
    let pinned = [...featured, ...others].slice(0, 6);
    
    // If no repositories match criteria, return at least some repositories or fallback data
    if (pinned.length === 0) {
      // Try to get any original repositories (non-forks)
      if (originalRepos.length > 0) {
        pinned = originalRepos.slice(0, 3);
      } else {
        // Return fallback data if no suitable repositories found
        return this.fallbackData;
      }
    }
    
    // Transform to required format
    return pinned.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      html_url: repo.html_url,
      language: repo.language || 'Unknown',
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at,
      topics: repo.topics || [],
      homepage: repo.homepage
    }));
  }

  /**
   * Check if cached data is still valid
   * @param {string} cacheKey - Cache key to check
   * @returns {boolean} True if cache is valid
   */
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    return (Date.now() - cached.timestamp) < this.cacheTimeout;
  }

  /**
   * Get fallback data when GitHub API is unavailable
   * @returns {Array} Array of fallback repository objects
   */
  getFallbackData() {
    return [
      {
        id: 1,
        name: 'PHARMUP',
        description: 'A comprehensive pharmaceutical management system built with modern web technologies',
        html_url: 'https://github.com/lewisgathaiya/pharmup',
        language: 'JavaScript',
        stargazers_count: 0,
        updated_at: new Date().toISOString(),
        topics: ['pharmacy', 'management', 'healthcare'],
        homepage: null
      },
      {
        id: 2,
        name: 'SECULEARN',
        description: 'An innovative security learning platform for cybersecurity education',
        html_url: 'https://github.com/lewisgathaiya/seculearn',
        language: 'Python',
        stargazers_count: 0,
        updated_at: new Date().toISOString(),
        topics: ['security', 'education', 'cybersecurity'],
        homepage: null
      },
      {
        id: 3,
        name: 'lewis-portfolio-website',
        description: 'Modern portfolio website with animated backgrounds and multilingual support',
        html_url: 'https://github.com/lewisgathaiya/lewis-portfolio-website',
        language: 'JavaScript',
        stargazers_count: 0,
        updated_at: new Date().toISOString(),
        topics: ['portfolio', 'react', 'nextjs'],
        homepage: 'https://mwangilewis.com'
      }
    ];
  }

  /**
   * Fetch user profile information
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} User profile object
   */
  async fetchUserProfile(username = this.username) {
    const cacheKey = `user_profile_${username}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      const url = `${this.apiBaseUrl}/users/${username}`;
      
      return new Promise((resolve, reject) => {
        const options = {
          headers: {
            'User-Agent': 'Lewis-Portfolio-Website',
            'Accept': 'application/vnd.github.v3+json'
          }
        };

        if (process.env.GITHUB_TOKEN) {
          options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const req = https.get(url, options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              if (res.statusCode === 200) {
                const profile = JSON.parse(data);
                
                // Cache the results
                this.cache.set(cacheKey, {
                  data: profile,
                  timestamp: Date.now()
                });

                resolve(profile);
              } else {
                reject(new Error(`GitHub API returned status ${res.statusCode}`));
              }
            } catch (error) {
              reject(new Error(`Failed to parse GitHub API response: ${error.message}`));
            }
          });
        });

        req.on('error', (error) => {
          reject(new Error(`GitHub API request failed: ${error.message}`));
        });

        req.setTimeout(10000, () => {
          req.destroy();
          reject(new Error('GitHub API request timeout'));
        });
      });
    } catch (error) {
      console.error('GitHub profile fetch error:', error.message);
      
      // Return cached data if available
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        return cachedData.data;
      }
      
      throw error;
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache() {
    this.cache.clear();
    console.log('GitHub service cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout
    };
  }
}

module.exports = new GitHubService();