const githubService = require('./githubService');

/**
 * Scheduler service for periodic data refresh
 */
class Scheduler {
  constructor() {
    this.intervals = new Map();
    this.isRunning = false;
  }

  /**
   * Start the scheduler with periodic GitHub data refresh
   */
  start() {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log('Starting scheduler service...');
    this.isRunning = true;

    // Refresh GitHub data every 2 hours
    const githubRefreshInterval = setInterval(async () => {
      try {
        console.log('Performing scheduled GitHub data refresh...');
        await githubService.fetchPinnedRepos();
        console.log('Scheduled GitHub data refresh completed');
      } catch (error) {
        console.error('Scheduled GitHub refresh failed:', error.message);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours

    this.intervals.set('github-refresh', githubRefreshInterval);

    // Initial data fetch on startup
    this.performInitialDataFetch();

    console.log('Scheduler service started successfully');
  }

  /**
   * Stop the scheduler and clear all intervals
   */
  stop() {
    if (!this.isRunning) {
      console.log('Scheduler is not running');
      return;
    }

    console.log('Stopping scheduler service...');
    
    // Clear all intervals
    for (const [name, interval] of this.intervals) {
      clearInterval(interval);
      console.log(`Cleared interval: ${name}`);
    }

    this.intervals.clear();
    this.isRunning = false;

    console.log('Scheduler service stopped');
  }

  /**
   * Perform initial data fetch on application startup
   */
  async performInitialDataFetch() {
    try {
      console.log('Performing initial GitHub data fetch...');
      await githubService.fetchPinnedRepos();
      console.log('Initial GitHub data fetch completed');
    } catch (error) {
      console.error('Initial GitHub data fetch failed:', error.message);
      console.log('Application will continue with fallback data');
    }
  }

  /**
   * Get scheduler status
   * @returns {Object} Scheduler status information
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeIntervals: Array.from(this.intervals.keys()),
      intervalCount: this.intervals.size
    };
  }

  /**
   * Manually trigger GitHub data refresh
   */
  async triggerGitHubRefresh() {
    try {
      console.log('Manual GitHub data refresh triggered...');
      githubService.clearCache();
      await githubService.fetchPinnedRepos();
      console.log('Manual GitHub data refresh completed');
      return true;
    } catch (error) {
      console.error('Manual GitHub refresh failed:', error.message);
      return false;
    }
  }
}

module.exports = new Scheduler();