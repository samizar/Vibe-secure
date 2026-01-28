/**
 * Checks for dangerous React patterns (XSS risks)
 * @param {string} content - File content
 * @param {string} filePath - Path to file
 * @returns {Array} - Array of issues found
 */
function checkForDangerousReact(content, filePath) {
  const issues = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // 1. dangerouslySetInnerHTML
    if (line.includes('dangerouslySetInnerHTML')) {
       issues.push({
        file: filePath,
        line: index + 1,
        type: 'Warning',
        message: 'Dangerous React Pattern (XSS Risk)',
        code: line.trim()
      });
    }

    // 2. javascript: URIs in href or src
    if (/['"]javascript:/i.test(line)) {
      issues.push({
        file: filePath,
        line: index + 1,
        type: 'Critical',
        message: 'Inline JavaScript URI (XSS Risk)',
        code: line.trim()
      });
    }
    
    // 3. eval()
    if (/\beval\s*\(/.test(line)) {
      issues.push({
        file: filePath,
        line: index + 1,
        type: 'Critical',
        message: 'Use of eval() detected',
        code: line.trim()
      });
    }
  });

  return issues;
}

module.exports = { checkForDangerousReact };
