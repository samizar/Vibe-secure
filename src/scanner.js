const fs = require('fs').promises;
const path = require('path');

async function scanFolder(dir, fileList = []) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    const ignoredDirs = ['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage', '.vercel'];
    if (stat.isDirectory()) {
      if (!ignoredDirs.includes(file)) {
        await scanFolder(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

module.exports = { scanFolder };
