import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Configure marked with KaTeX and image handling
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
  },
  image(href, title, text) {
    try {
      // If it's an external URL (starts with http:// or https://)
      if (href.match(/^https?:\/\//)) {
        return `<img src="${href}" alt="${text}" title="${title || ''}" class="blog-image" />`;
      }

      // For local images, first try post-specific directory
      const postSlug = window.location.pathname.split('/').pop();
      try {
        const postSpecificImg = new URL(`../assets/posts/${postSlug}/${href}`, import.meta.url).href;
        return `<img src="${postSpecificImg}" alt="${text}" title="${title || ''}" class="blog-image" />`;
      } catch {
        // If not found in post directory, try common assets
        const commonImg = new URL(`../assets/${href}`, import.meta.url).href;
        return `<img src="${commonImg}" alt="${text}" title="${title || ''}" class="blog-image" />`;
      }
    } catch (err) {
      console.warn('Failed to load image:', href);
      return `<img src="${href}" alt="${text}" title="${title || ''}" class="blog-image" />`;
    }
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
        updatedAt: dates.updatedAt,
        hidden: metadata.hidden || post.hidden || false,
        summary: metadata.summary || post.summary
      };
    })
    .filter(post => !post.hidden)
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