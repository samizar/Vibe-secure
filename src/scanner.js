const fs = require('fs').promises;
const path = require('path');

async function scanFolder(dir, fileList = []) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
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
