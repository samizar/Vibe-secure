/**
 * Checks for potential SQL injection vulnerabilities
 * @param {string} content - File content
 * @param {string} filePath - Path to file
 * @returns {Array} - Array of issues found
 */
function checkForSqlInjection(content, filePath) {
  const issues = [];
  const lines = content.split('\n');

  // Regex to look for:
  // 1. Strings starting with SELECT/INSERT/UPDATE/DELETE (case insensitive)
  // 2. That contain variable interpolation ${...} or string concatenation ' + '
  
  // Heuristic:
  // const query = `SELECT * FROM users WHERE id = ${id}`;  <-- BAD
  // db.query('SELECT * FROM users WHERE id = ' + id);      <-- BAD
  
  lines.forEach((line, index) => {
    // Check for template literal interpolation in SQL strings
    if (/\`\s*(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\s+.*?\$\{.*?\}/i.test(line)) {
      issues.push({
        file: filePath,
        line: index + 1,
        type: 'Critical',
        message: 'Potential SQL Injection (Template Literal)',
        code: line.trim()
      });
    }

    // Check for string concatenation in SQL strings (simple check)
    // Matches: 'SELECT ... ' + variable
    if (/['"]\s*(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\s+.*?['"]\s*\+/i.test(line) || 
        /\+\s*['"]\s*(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\s+.*?['"]/i.test(line)) {
      issues.push({
        file: filePath,
        line: index + 1,
        type: 'Critical',
        message: 'Potential SQL Injection (String Concatenation)',
        code: line.trim()
      });
    }
  });

  return issues;
}

module.exports = { checkForSqlInjection };
