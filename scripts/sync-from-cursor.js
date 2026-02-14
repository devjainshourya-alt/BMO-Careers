/**
 * Auto-sync: Watches the main project folder (Cursor IDE) for changes
 * and copies them into the Claude Code worktree automatically.
 *
 * Run with: node scripts/sync-from-cursor.js
 *
 * This ensures edits made in Cursor are immediately available in the
 * Claude Code worktree without manual git pull/stash workflows.
 */

const fs = require('fs');
const path = require('path');

// Paths
const CURSOR_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const WORKTREE_ROOT = path.resolve(__dirname, '..');

// Files/folders to watch and sync
const WATCH_PATTERNS = [
  'styles.css',
  'index.html',
  'campus.html',
  'bs-config.js',
  'package.json',
];

// Folders to watch recursively
const WATCH_DIRS = [
  'assets',
  'scripts',
];

// Debounce map to avoid duplicate syncs
const debounceTimers = {};

function syncFile(relativePath) {
  const src = path.join(CURSOR_ROOT, relativePath);
  const dest = path.join(WORKTREE_ROOT, relativePath);

  try {
    if (!fs.existsSync(src)) {
      // File was deleted in Cursor — delete in worktree too
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
        console.log(`[sync] Deleted: ${relativePath}`);
      }
      return;
    }

    // Ensure destination directory exists
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Only copy if content actually differs
    if (fs.existsSync(dest)) {
      const srcStat = fs.statSync(src);
      const destStat = fs.statSync(dest);
      // Quick check: same size and dest is newer = skip
      if (srcStat.size === destStat.size && srcStat.mtimeMs <= destStat.mtimeMs) {
        return;
      }
    }

    fs.copyFileSync(src, dest);
    const now = new Date().toLocaleTimeString();
    console.log(`[sync ${now}] Updated: ${relativePath}`);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`[sync] Error syncing ${relativePath}:`, err.message);
    }
  }
}

function debouncedSync(relativePath) {
  if (debounceTimers[relativePath]) {
    clearTimeout(debounceTimers[relativePath]);
  }
  debounceTimers[relativePath] = setTimeout(() => {
    syncFile(relativePath);
    delete debounceTimers[relativePath];
  }, 300);
}

// Watch individual files
for (const file of WATCH_PATTERNS) {
  const fullPath = path.join(CURSOR_ROOT, file);
  if (fs.existsSync(fullPath)) {
    fs.watch(fullPath, () => {
      debouncedSync(file);
    });
    console.log(`[watch] Watching file: ${file}`);
  }
}

// Watch directories recursively
for (const dir of WATCH_DIRS) {
  const fullDir = path.join(CURSOR_ROOT, dir);
  if (fs.existsSync(fullDir)) {
    fs.watch(fullDir, { recursive: true }, (eventType, filename) => {
      if (filename && !filename.includes('node_modules')) {
        const relativePath = path.join(dir, filename);
        debouncedSync(relativePath);
      }
    });
    console.log(`[watch] Watching directory: ${dir}/`);
  }
}

console.log('');
console.log('=== Cursor → Claude Code auto-sync running ===');
console.log(`  Cursor folder:    ${CURSOR_ROOT}`);
console.log(`  Worktree folder:  ${WORKTREE_ROOT}`);
console.log('  Edits in Cursor will auto-sync here.');
console.log('  Press Ctrl+C to stop.');
console.log('');

// Do an initial sync of all watched files
console.log('[sync] Initial sync...');
for (const file of WATCH_PATTERNS) {
  syncFile(file);
}
for (const dir of WATCH_DIRS) {
  const fullDir = path.join(CURSOR_ROOT, dir);
  if (fs.existsSync(fullDir)) {
    function walkDir(dirPath) {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullEntry = path.join(dirPath, entry.name);
        const rel = path.relative(CURSOR_ROOT, fullEntry);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git') {
            walkDir(fullEntry);
          }
        } else {
          syncFile(rel);
        }
      }
    }
    walkDir(fullDir);
  }
}
console.log('[sync] Initial sync complete.\n');
