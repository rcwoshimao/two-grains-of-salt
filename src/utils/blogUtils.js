import { marked } from 'marked';
import { execSync } from 'child_process';

// Import all blog posts
const blogPosts = import.meta.glob('../posts/*.js', { eager: true });

const getGitDates = (filePath) => {
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
    // Fallback to current date if Git command fails
    const now = new Date().toISOString();
    return {
      createdAt: now,
      updatedAt: now
    };
  }
};

export const getAllPosts = () => {
  return Object.entries(blogPosts)
    .map(([filePath, post]) => {
      const gitDates = getGitDates(filePath);
      return {
        ...post.metadata,
        createdAt: gitDates.createdAt,
        updatedAt: gitDates.updatedAt
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getPostBySlug = (slug) => {
  const [filePath, post] = Object.entries(blogPosts).find(
    ([_, post]) => post.metadata.slug === slug
  ) || [null, null];
  
  if (!post) return null;
  
  const gitDates = getGitDates(filePath);
  
  return {
    ...post.metadata,
    createdAt: gitDates.createdAt,
    updatedAt: gitDates.updatedAt,
    content: marked(post.content)
  };
}; 