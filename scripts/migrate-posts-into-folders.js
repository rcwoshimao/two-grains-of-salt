import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'src', 'posts');
const ASSETS_POSTS_DIR = path.join(ROOT_DIR, 'src', 'assets', 'posts');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const OVERWRITE_ASSETS = args.has('--overwrite-assets');
const COPY_POSTS = args.has('--copy-posts');

function ensureDir(dirPath) {
  if (DRY_RUN) return;
  fs.mkdirSync(dirPath, { recursive: true });
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function copyRecursive(srcPath, destPath) {
  const stat = fs.statSync(srcPath);

  if (stat.isDirectory()) {
    if (!DRY_RUN) fs.mkdirSync(destPath, { recursive: true });
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });
    for (const entry of entries) {
      copyRecursive(path.join(srcPath, entry.name), path.join(destPath, entry.name));
    }
    return;
  }

  if (!stat.isFile()) return;

  if (isFile(destPath) && !OVERWRITE_ASSETS) {
    console.log(`SKIP asset (exists): ${path.relative(ROOT_DIR, destPath)}`);
    return;
  }

  console.log(`COPY asset: ${path.relative(ROOT_DIR, srcPath)} -> ${path.relative(ROOT_DIR, destPath)}`);
  if (!DRY_RUN) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
}

function moveOrCopyPostFile(srcPostPath, destPostPath) {
  if (isFile(destPostPath)) {
    console.log(`SKIP post (already migrated): ${path.relative(ROOT_DIR, destPostPath)}`);
    return;
  }

  if (!isFile(srcPostPath)) {
    console.log(`SKIP post (missing): ${path.relative(ROOT_DIR, srcPostPath)}`);
    return;
  }

  if (COPY_POSTS) {
    console.log(`COPY post: ${path.relative(ROOT_DIR, srcPostPath)} -> ${path.relative(ROOT_DIR, destPostPath)}`);
    if (!DRY_RUN) fs.copyFileSync(srcPostPath, destPostPath);
    return;
  }

  console.log(`MOVE post: ${path.relative(ROOT_DIR, srcPostPath)} -> ${path.relative(ROOT_DIR, destPostPath)}`);
  if (!DRY_RUN) fs.renameSync(srcPostPath, destPostPath);
}

function main() {
  if (!isDirectory(POSTS_DIR)) {
    console.error(`Posts dir not found: ${POSTS_DIR}`);
    process.exitCode = 1;
    return;
  }

  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const postFiles = entries
    .filter((d) => d.isFile() && d.name.endsWith('.js'))
    .map((d) => d.name);

  if (postFiles.length === 0) {
    console.log('No top-level post .js files found to migrate.');
    return;
  }

  console.log(`Found ${postFiles.length} post files in ${path.relative(ROOT_DIR, POSTS_DIR)}`);
  if (DRY_RUN) console.log('DRY RUN enabled: no files will be changed.');
  if (COPY_POSTS) console.log('COPY_POSTS enabled: post files will be copied (not moved).');
  if (OVERWRITE_ASSETS) console.log('OVERWRITE_ASSETS enabled: existing destination assets will be overwritten.');

  for (const fileName of postFiles) {
    const slug = fileName.replace(/\.js$/, '');
    const srcPostPath = path.join(POSTS_DIR, fileName);
    const destDir = path.join(POSTS_DIR, slug);
    const destPostPath = path.join(destDir, fileName);

    console.log(`\n=== ${slug} ===`);
    console.log(`ENSURE dir: ${path.relative(ROOT_DIR, destDir)}`);
    ensureDir(destDir);

    moveOrCopyPostFile(srcPostPath, destPostPath);

    const matchingAssetsDir = path.join(ASSETS_POSTS_DIR, slug);
    if (isDirectory(matchingAssetsDir)) {
      console.log(`Assets found: ${path.relative(ROOT_DIR, matchingAssetsDir)}`);
      copyRecursive(matchingAssetsDir, destDir);
    } else {
      console.log('Assets found: (none)');
    }
  }

  console.log('\nDone.');
  console.log('Next steps: update blog importer + image resolver, then regenerate git-history.');
}

main();

