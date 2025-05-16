import { marked } from 'marked';

// Import all blog posts
const blogPosts = import.meta.glob('../posts/*.js', { eager: true });

// Import git history
let gitHistory = {};
try {
  // Use dynamic import with a default value
  gitHistory = (await import('../data/git-history.json', { assert: { type: 'json' } })).default || {};
} catch (error) {
  console.warn('Could not load git-history.json, using current date for all posts');
}

const getPostDates = (fileName) => {
  return gitHistory[fileName] || {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const getAllPosts = () => {
  return Object.entries(blogPosts)
    .map(([filePath, post]) => {
      const fileName = filePath.split('/').pop();
      const dates = getPostDates(fileName);
      return {
        ...post.metadata,
        createdAt: dates.createdAt,
        updatedAt: dates.updatedAt
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getPostBySlug = (slug) => {
  const [filePath, post] = Object.entries(blogPosts).find(
    ([_, post]) => post.metadata.slug === slug
  ) || [null, null];
  
  if (!post) return null;
  
  const fileName = filePath.split('/').pop();
  const dates = getPostDates(fileName);
  
  return {
    ...post.metadata,
    createdAt: dates.createdAt,
    updatedAt: dates.updatedAt,
    content: marked(post.content)
  };
}; 