import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/posts');
const HISTORY_PATH = path.join(__dirname, '../src/data/git-history.json');

function walkJsFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.trim().endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

function runGit(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

/**
 * Parse creation date from filename conventions:
 * - YYYYMMDD-title.js  (preferred)
 * - title-YYYYMMDD.js
 * - MMDDYYYY-title.js  (legacy)
 */
function getCreatedAtFromFilename(fileName) {
  const base = fileName.trim().replace(/\.js$/i, '');

  let match = base.match(/^(\d{4})(\d{2})(\d{2})(?:-|$)/);
  if (match) {
    return toIsoDate(match[1], match[2], match[3]);
  }

  match = base.match(/-(\d{4})(\d{2})(\d{2})$/);
  if (match) {
    return toIsoDate(match[1], match[2], match[3]);
  }

  match = base.match(/^(\d{2})(\d{2})(\d{4})(?:-|$)/);
  if (match) {
    return toIsoDate(match[3], match[1], match[2]);
  }

  return null;
}

function toIsoDate(year, month, day) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  // Noon UTC avoids timezone day-shift when displayed locally.
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).toISOString();
}

function getStaticDate(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const dateMatch = content.match(/export const date = ["'](.+?)["']/);
    if (dateMatch) {
      const parsed = new Date(dateMatch[1]);
      if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
    }
  } catch {
    // ignore
  }
  return null;
}

function getGitUpdatedAt(filePath) {
  const quoted = `"${filePath}"`;
  return (
    runGit(`git log --follow -1 --format=%aI -- ${quoted}`) ||
    runGit(`git log -1 --format=%aI -- ${quoted}`) ||
    null
  );
}

function getGitCreatedAt(filePath) {
  const quoted = `"${filePath}"`;
  const followed = runGit(`git log --follow --diff-filter=A --format=%aI -- ${quoted}`)
    .split('\n')
    .filter(Boolean)
    .pop();
  if (followed) return followed;

  return (
    runGit(`git log --diff-filter=A --format=%aI -- ${quoted}`)
      .split('\n')
      .filter(Boolean)
      .pop() || null
  );
}

function getFileMtimeIso(filePath) {
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return null;
  }
}

function laterIso(a, b) {
  if (!a) return b;
  if (!b) return a;
  return new Date(a) >= new Date(b) ? a : b;
}

function generateGitHistory() {
  const files = walkJsFiles(POSTS_DIR);
  const posts = {};
  const seen = new Map();

  for (const filePath of files) {
    const fileName = path.basename(filePath).trim();
    if (seen.has(fileName)) {
      console.warn(
        `Duplicate basename "${fileName}" — slug collision between:\n` +
          `  - ${seen.get(fileName)}\n` +
          `  - ${filePath}`
      );
    }
    seen.set(fileName, filePath);

    const fromFilename = getCreatedAtFromFilename(fileName);
    const fromGitCreate = getGitCreatedAt(filePath);
    const fromStatic = getStaticDate(filePath);
    const fromGitUpdate = getGitUpdatedAt(filePath);
    const fromMtime = getFileMtimeIso(filePath);

    // Creation date priority: filename prefix > git first-add > export const date > mtime
    const createdAt =
      fromFilename || fromGitCreate || fromStatic || fromMtime || new Date().toISOString();

    // Update date: latest meaningful git edit, else mtime, never earlier than createdAt.
    // If git create === git update (rename-only / brand-new), prefer mtime when later.
    let updatedAt = fromGitUpdate || fromMtime || createdAt;
    if (fromGitCreate && fromGitUpdate && fromGitCreate === fromGitUpdate && fromMtime) {
      updatedAt = laterIso(fromGitUpdate, fromMtime);
    }
    updatedAt = laterIso(createdAt, updatedAt);

    posts[fileName] = { createdAt, updatedAt };

    const source = fromFilename
      ? 'filename'
      : fromGitCreate
        ? 'git'
        : fromStatic
          ? 'static'
          : 'mtime';
    console.log(`${fileName}: created=${createdAt.slice(0, 10)} (${source}), updated=${updatedAt.slice(0, 10)}`);
  }

  fs.mkdirSync(path.dirname(HISTORY_PATH), { recursive: true });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(posts, null, 2) + '\n');
  console.log(`\nGit history generated for ${Object.keys(posts).length} posts.`);
}

generateGitHistory();
