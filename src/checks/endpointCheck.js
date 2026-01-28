/**
 * Checks for potentially unsafe API endpoints (no auth)
 * @param {string} content - File content
 * @param {string} filePath - Path to file
 * @returns {Array} - Array of issues found
 */
function checkForUnsafeEndpoints(content, filePath) {
  const issues = [];
  const lines = content.split('\n');

  // Look for Express/Next.js route definitions
  // app.get('/api/users', (req, res) => ...)
  // export default function handler(req, res) ...
  
  // This is a naive check: looks for route definitions that DON'T look like they use middleware
  // Or simply flagging all routes for manual review (which might be too noisy)
  
  // Better approach for "vibe coded" apps: Look for 'delete' or 'update' routes without some 'auth' keyword nearby
  
  lines.forEach((line, index) => {
    // Check for dangerous operations
    if ((line.includes('app.delete') || line.includes('app.post') || line.includes('app.put')) && 
        !line.includes('auth') && 
        !line.includes('middleware') &&
        !line.includes('verify')) {
      
      // Look ahead a few lines for auth checks? (Start simple)
       issues.push({
        file: filePath,
        line: index + 1,
        type: 'Warning',
        message: 'Potential Unsafe Endpoint (Mutation without Auth)',
        code: line.trim()
      });
    }
  });

  return issues;
}

module.exports = { checkForUnsafeEndpoints };
