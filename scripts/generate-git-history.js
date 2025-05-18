import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/posts');

function getStaticDate(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const dateMatch = content.match(/export const date = ["'](.+?)["']/);
    if (dateMatch) {
      return new Date(dateMatch[1]).toISOString();
    }
  } catch (error) {
    console.warn(`Could not read static date from ${filePath}:`, error);
  }
  return null;
}

function getGitDates(filePath) {
  try {
    // Get creation date (first commit)
    const createdDate = execSync(
      `git log --diff-filter=A --format=%aI -- ${filePath}`,
      { encoding: 'utf-8' }
    ).trim().split('\n').pop();

    // Get last modified date
    const updatedDate = execSync(
      `git log -1 --format=%aI -- ${filePath}`,
      { encoding: 'utf-8' }
    ).trim();

    return {
      createdAt: createdDate,
      updatedAt: updatedDate
    };
  } catch (error) {
    console.warn(`Could not get Git dates for ${filePath}:`, error);
    // Try to get the static date from the file
    const staticDate = getStaticDate(filePath);
    if (staticDate) {
      return {
        createdAt: staticDate,
        updatedAt: staticDate
      };
    }
    // If all else fails, use current date
    const now = new Date().toISOString();
    return {
      createdAt: now,
      updatedAt: now
    };
  }
}

function generateGitHistory() {
  const posts = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.js'))
    .reduce((acc, file) => {
      const filePath = path.join(POSTS_DIR, file);
      const dates = getGitDates(filePath);
      acc[file] = dates;
      return acc;
    }, {});

  const outputPath = path.join(__dirname, '../src/data/git-history.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log('Git history generated successfully!');
}

generateGitHistory(); 