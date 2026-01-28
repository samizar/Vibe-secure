/**
 * Checks for exposed database URLs
 * @param {string} content - File content
 * @param {string} filePath - Path to file
 * @returns {Array} - Array of issues found
 */
function checkForDatabaseUrls(content, filePath) {
  const issues = [];
  const lines = content.split('\n');

  // postgres://user:password@localhost:5432/mydb
  // mongodb+srv://user:password@cluster.mongodb.net
  const dbPattern = /((postgres|mysql|mongodb|redis)(\+[a-z]+)?):\/\/[a-zA-Z0-9_]+:[^@]+@/i;

  lines.forEach((line, index) => {
    if (dbPattern.test(line) && !line.includes('process.env')) {
      issues.push({
        file: filePath,
        line: index + 1,
        type: 'Critical',
        message: 'Exposed Database Connection String',
        code: line.trim()
      });
    }
  });

  return issues;
}

module.exports = { checkForDatabaseUrls };
