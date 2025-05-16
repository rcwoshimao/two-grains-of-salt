const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to get Git dates for a file
function getGitDates(filePath) {
  try {
    // Get creation date (first commit)
    const created = execSync(
      `git log --diff-filter=A --format="%aI" -- "${filePath}" | tail -n 1`
    ).toString().trim();

    // Get last modified date
    const modified = execSync(
      `git log -1 --format="%aI" -- "${filePath}"`
    ).toString().trim();

    return {
      createdAt: created,
      updatedAt: modified
    };
  } catch (error) {
    console.warn(`Warning: Could not get Git dates for ${filePath}, using current date`);
    const now = new Date().toISOString();
    return {
      createdAt: now,
      updatedAt: now
    };
  }
}

// Get all post files
const postsDir = path.join(__dirname, '../src/posts');
const postFiles = fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.js'));

// Generate dates for each post
const postDates = {};
postFiles.forEach(file => {
  const filePath = path.join(postsDir, file);
  postDates[file] = getGitDates(filePath);
});

// Write to a JSON file
const outputPath = path.join(__dirname, '../src/data/post-dates.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(postDates, null, 2));

console.log('Post dates generated successfully!'); 