import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../src/data');
const gitHistoryPath = path.join(dataDir, 'git-history.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create empty git-history.json if it doesn't exist
if (!fs.existsSync(gitHistoryPath)) {
  fs.writeFileSync(gitHistoryPath, JSON.stringify({}, null, 2));
  console.log('Created empty git-history.json');
} 