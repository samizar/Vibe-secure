/**
 * Checks for common hardcoded secrets and patterns
 * @param {string} content - File content
 * @param {string} filePath - Path to file
 * @returns {Array} - Array of issues found
 */
function checkForSecrets(content, filePath) {
  const issues = [];
  const lines = content.split('\n');

  const patterns = [
    { name: 'Stripe Secret Key', regex: /sk_live_[a-zA-Z0-9]{24}/ },
    { name: 'Generic API Key', regex: /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/i },
    { name: 'Hardcoded Password', regex: /password\s*[:=]\s*['"][^'"]{6,}['"]/i },
    { name: 'AWS Access Key', regex: /AKI[A-Z0-9]{17}/ },
    { name: 'Private Key Block', regex: /-----BEGIN PRIVATE KEY-----/ }
  ];

  lines.forEach((line, index) => {
    // Basic check for very long strings that look like keys (entropy check heuristic simplified)
    // Only check lines that look like assignments
    
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          type: 'Critical',
          message: `Possible ${pattern.name} found`,
          code: line.trim()
        });
      }
    }
  });

  return issues;
}

module.exports = { checkForSecrets };
