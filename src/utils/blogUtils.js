import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Configure marked with KaTeX
const renderer = {
  code(code, language) {
    if (language === 'math') {
      try {
        return katex.renderToString(code, {
          throwOnError: false,
          displayMode: true
        });
      } catch (err) {
        return code;
      }
    }
    return false; // Let marked handle other languages
  },
  codespan(code) {
    if (code.startsWith('$') && code.endsWith('$')) {
      try {
        return katex.renderToString(code.slice(1, -1), {
          throwOnError: false,
          displayMode: false
        });
      } catch (err) {
        return code;
      }
    }
    return false; // Let marked handle regular inline code
  }
};

marked.use({ renderer });

// Import all blog posts
const blogPosts = import.meta.glob('../posts/*.js', { eager: true });

// Import git history
let gitHistory = {};
try {
  gitHistory = (await import('../data/git-history.json', { assert: { type: 'json' } })).default || {};
} catch (error) {
  console.warn('Could not load git-history.json, using current date for all posts');
}

// Function to get post dates
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
      const slug = fileName.replace('.js', '');
      
      // Handle both metadata formats
      const metadata = post.metadata || {};
      return {
        title: metadata.title || post.title,
        date: metadata.createdAt || post.date,
        slug: metadata.slug || post.slug || slug,
        createdAt: dates.createdAt,
        updatedAt: dates.updatedAt
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getPostBySlug = (slug) => {
  const [filePath, post] = Object.entries(blogPosts).find(
    ([_, post]) => {
      const metadata = post.metadata || {};
      return metadata.slug === slug || post.slug === slug;
    }
  ) || [null, null];
  
  if (!post) return null;
  
  const fileName = filePath.split('/').pop();
  const dates = getPostDates(fileName);
  const metadata = post.metadata || {};
  
  return {
    title: metadata.title || post.title,
    date: metadata.createdAt || post.date,
    slug: metadata.slug || post.slug || fileName.replace('.js', ''),
    createdAt: dates.createdAt,
    updatedAt: dates.updatedAt,
    content: marked(post.content)
  };
}; 