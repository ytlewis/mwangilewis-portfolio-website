const express = require('express');
const githubService = require('../services/githubService');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for GitHub API endpoints
const githubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    message: 'Too many GitHub API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.use(githubLimiter);

/**
 * GET /api/github/repos
 * Fetch pinned repositories from GitHub
 */
router.get('/repos', async (req, res) => {
  try {
    const repos = await githubService.fetchPinnedRepos();
    
    res.json({
      success: true,
      repos: repos,
      cached: githubService.isCacheValid('pinned_repos_lewisgathaiya'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub repos endpoint error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GitHub repositories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/github/profile
 * Fetch user profile from GitHub
 */
router.get('/profile', async (req, res) => {
  try {
    const profile = await githubService.fetchUserProfile();
    
    res.json({
      success: true,
      profile: {
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        blog: profile.blog,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        avatar_url: profile.avatar_url,
        html_url: profile.html_url
      },
      cached: githubService.isCacheValid('user_profile_lewisgathaiya'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub profile endpoint error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GitHub profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/github/refresh
 * Manually refresh GitHub data cache
 */
router.post('/refresh', async (req, res) => {
  try {
    // Clear cache to force fresh data fetch
    githubService.clearCache();
    
    // Fetch fresh data
    const repos = await githubService.fetchPinnedRepos();
    
    res.json({
      success: true,
      message: 'GitHub data refreshed successfully',
      repos: repos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub refresh endpoint error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to refresh GitHub data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/github/cache/stats
 * Get cache statistics (development only)
 */
router.get('/cache/stats', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({
      success: false,
      message: 'Endpoint not available in production'
    });
  }

  const stats = githubService.getCacheStats();
  
  res.json({
    success: true,
    cache: stats,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;