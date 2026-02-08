/**
 * DNS Configuration Fix
 * 
 * This module configures Node.js to use Google DNS servers
 * to resolve MongoDB Atlas hostnames when local DNS fails.
 */

const dns = require('dns');

/**
 * Configure DNS to use Google's public DNS servers
 * This fixes issues with local DNS not resolving MongoDB Atlas hostnames
 */
function configureGoogleDNS() {
  try {
    // Set DNS servers to Google's public DNS
    dns.setServers([
      '8.8.8.8',  // Google DNS Primary
      '8.8.4.4',  // Google DNS Secondary
      '1.1.1.1',  // Cloudflare DNS (fallback)
      '1.0.0.1'   // Cloudflare DNS Secondary (fallback)
    ]);
    
    console.log('✓ DNS configured to use Google DNS (8.8.8.8, 8.8.4.4)');
    return true;
  } catch (error) {
    console.error('✗ Failed to configure DNS:', error.message);
    return false;
  }
}

module.exports = { configureGoogleDNS };
