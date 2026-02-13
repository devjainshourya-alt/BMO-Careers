#!/usr/bin/env node
/**
 * Deploy script — commits and pushes changes to the remote repository.
 * With GitHub Pages (or similar), pushing to main triggers deployment.
 *
 * Usage:
 *   node scripts/deploy.js [commit message]
 *   npm run deploy -- "Fix hero section spacing"
 *
 * Prerequisites:
 *   - Git initialized (git init)
 *   - Remote configured (git remote add origin <url>)
 *   - See DEPLOY.md for full setup
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

function run(cmd, options = {}) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: options.silent ? 'pipe' : 'inherit' });
  } catch (e) {
    if (!options.ignoreError) throw e;
    return null;
  }
}

function hasGit() {
  try {
    run('git rev-parse --is-inside-work-tree', { silent: true });
    return true;
  } catch {
    return false;
  }
}

function hasRemote() {
  try {
    const out = run('git remote -v', { silent: true });
    return out && out.trim().length > 0;
  } catch {
    return false;
  }
}

function hasChanges() {
  try {
    const status = run('git status --porcelain', { silent: true });
    return status && status.trim().length > 0;
  } catch {
    return false;
  }
}

function getDefaultBranch() {
  try {
    const ref = run('git symbolic-ref refs/remotes/origin/HEAD', { silent: true });
    const match = ref.match(/refs\/remotes\/origin\/(.+)/);
    return match ? match[1].trim() : 'main';
  } catch {
    return 'main';
  }
}

function main() {
  const msg = process.argv.slice(2).join(' ') || 'Deploy: updates from FigJam feedback';

  if (!hasGit()) {
    console.error('Git is not initialized. Run: git init');
    process.exit(1);
  }

  if (!hasRemote()) {
    console.error('No Git remote configured. Add one with: git remote add origin <your-repo-url>');
    process.exit(1);
  }

  if (!hasChanges()) {
    console.log('No changes to deploy. Working tree is clean.');
    process.exit(0);
  }

  const branch = getDefaultBranch();

  run('git add -A');
  const commitResult = spawnSync('git', ['commit', '-m', msg], { cwd: root, stdio: 'inherit' });
  if (commitResult.status !== 0) process.exit(commitResult.status);
  run(`git push origin ${branch}`);

  console.log(`\nPushed to origin/${branch}. If using GitHub Pages, the site will update shortly.`);
}

main();
