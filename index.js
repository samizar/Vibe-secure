#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const { scanFolder } = require('./src/scanner');
const { checkForSecrets } = require('./src/checks/secrets');
const { checkForDatabaseUrls } = require('./src/checks/dbCheck');
const { checkForUnsafeEndpoints } = require('./src/checks/endpointCheck');
const { checkForSqlInjection } = require('./src/checks/sqlInjection.js');
const { checkForDangerousReact } = require('./src/checks/unsafeReact.js');
const fs = require('fs').promises;
const path = require('path');

const program = new Command();

console.log(chalk.cyan(figlet.textSync('Vibe Secure', { horizontalLayout: 'full' })));

program
  .version('1.0.0')
  .description('Security scanner for vibe-coded AI applications')
  .argument('[directory]', 'Directory to scan', '.')
  .action(async (directory) => {
    const targetDir = path.resolve(directory);
    console.log(chalk.blue(`\n🔍 Scanning directory: ${targetDir}\n`));

    try {
      const files = await scanFolder(targetDir);
      
      if (files.length === 0) {
        console.log(chalk.yellow('⚠️  No relevant implementation files found (.js, .jsx, .ts, .tsx).'));
        return;
      }

      console.log(chalk.gray(`Found ${files.length} files to check...`));
      
      let allIssues = [];

      for (const file of files) {
        // Skip scanning the checker files themselves to avoid false positives during dev
        if (file.includes('src/checks/')) continue;

        const content = await fs.readFile(file, 'utf8');
        const relativePath = path.relative(process.cwd(), file);
        
        const issues = [
          ...checkForSecrets(content, relativePath),
          ...checkForDatabaseUrls(content, relativePath),
          ...checkForUnsafeEndpoints(content, relativePath),
          ...checkForSqlInjection(content, relativePath),
          ...checkForDangerousReact(content, relativePath)
        ];
        
        allIssues = [...allIssues, ...issues];
      }

      console.log(chalk.gray('────────────────────────────────────────'));

      if (allIssues.length > 0) {
        console.log(chalk.red(`\n❌ Scan failed! Found ${allIssues.length} issues:\n`));
        
        allIssues.forEach(issue => {
          const color = issue.type === 'Critical' ? chalk.red.bold : chalk.yellow.bold;
          
          // Standard terminal format: /absolute/path/to/file:line:col
          // VS Code and other terminals auto-link this pattern to open the file at the line
          const absolutePath = path.resolve(process.cwd(), issue.file);
          
          console.log(`${color(`[${issue.type}]`)} ${chalk.underline(`${absolutePath}:${issue.line}:1`)}`);
          console.log(`  ${chalk.yellow(issue.message)}`);
          console.log(`  ${chalk.gray('>')} ${chalk.cyan(issue.code.substring(0, 60))}${issue.code.length > 60 ? '...' : ''}\n`);
        });
        
        console.log(chalk.red(`\n💥 Fix these ${allIssues.length} issues before shipping!`));
        process.exit(1);
      } else {
        console.log(chalk.green('\n✨ Vibes are pristine! No obvious security issues found.'));
        console.log(chalk.green('🚀 Ready to ship!'));
      }
      
    } catch (error) {
      console.error(chalk.red('\n❌ Error scanning folder:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

