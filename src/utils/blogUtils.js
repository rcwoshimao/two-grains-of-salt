import { marked } from 'marked';
import katex from 'katex';
import { v4 as uuidv4 } from 'uuid';
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
      const postId = window.location.pathname.split('/').pop();
      const post = getPostById(postId) || getPostBySlug(postId);
      if (post) {
        try {
          const postSpecificImg = new URL(`../assets/posts/${post.slug}/${href}`, import.meta.url).href;
          return `<img src="${postSpecificImg}" alt="${text}" title="${title || ''}" class="blog-image" />`;
        } catch {
          // If not found in post directory, try common assets
          const commonImg = new URL(`../assets/${href}`, import.meta.url).href;
          return `<img src="${commonImg}" alt="${text}" title="${title || ''}" class="blog-image" />`;
        }
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

// Function to ensure post has an ID
const ensurePostId = (post, fileName) => {
  const metadata = post.metadata || {};
  const slug = fileName.replace('.js', '');
  
  // Generate a consistent UUID based on the slug
  if (!metadata.id) {
    // Use the slug to generate a deterministic UUID
    metadata.id = uuidv4({ namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: slug });
  }
  return metadata;
};

export const getAllPosts = () => {
  return Object.entries(blogPosts)
    .map(([filePath, post]) => {
      const fileName = filePath.split('/').pop();
      const dates = getPostDates(fileName);
      const slug = fileName.replace('.js', '');
      
      // Handle both metadata formats
      const metadata = ensurePostId(post, fileName);
      return {
        id: metadata.id,
        title: metadata.title || post.title,
        date: metadata.createdAt || post.date,
        slug: metadata.slug || post.slug || slug,
        createdAt: dates.createdAt,
        updatedAt: dates.updatedAt,
        hidden: metadata.hidden || post.hidden || false,
        summary: metadata.summary || post.summary,
        tags: metadata.tags || post.tags || []
      };
    })
    .filter(post => !post.hidden)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getPostById = (id) => {
  const [filePath, post] = Object.entries(blogPosts).find(
    ([_, post]) => {
      const metadata = post.metadata || {};
      return metadata.id === id;
    }
  ) || [null, null];
  
  if (!post) return null;
  
  const fileName = filePath.split('/').pop();
  const dates = getPostDates(fileName);
  const metadata = ensurePostId(post, fileName);
  
  return {
    id: metadata.id,
    title: metadata.title || post.title,
    date: metadata.createdAt || post.date,
    slug: metadata.slug || post.slug || fileName.replace('.js', ''),
    createdAt: dates.createdAt,
    updatedAt: dates.updatedAt,
    content: marked(post.content),
    tags: metadata.tags || post.tags || []
  };
};

// Keep getPostBySlug for backward compatibility
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
  const metadata = ensurePostId(post, fileName);
  
  return {
    id: metadata.id,
    title: metadata.title || post.title,
    date: metadata.createdAt || post.date,
    slug: metadata.slug || post.slug || fileName.replace('.js', ''),
    createdAt: dates.createdAt,
    updatedAt: dates.updatedAt,
    content: marked(post.content),
    tags: metadata.tags || post.tags || []
  };
};

// Add a new function to get all unique tags organized by categories
export const getTagsByCategory = () => {
  const posts = getAllPosts();
  const categoryMap = {
    Tech: {
      name: 'Tech',
      subcategories: new Set()
    },
    Life: {
      name: 'Life',
      subcategories: new Set()
    },
    Other: {
      name: 'Other',
      subcategories: new Set()
    }
  };

  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      // Check if the tag itself is a main category
      if (categoryMap[tag]) {
        return;
      }

      // Try to find which category this tag belongs to
      if (tag.startsWith('Tech/')) {
        categoryMap.Tech.subcategories.add(tag.split('/')[1]);
      } else if (tag.startsWith('Life/')) {
        categoryMap.Life.subcategories.add(tag.split('/')[1]);
      } else {
        // If no category prefix, put in Other
        categoryMap.Other.subcategories.add(tag);
      }
    });
  });

  // Convert Sets to sorted arrays and remove empty categories
  return Object.entries(categoryMap)
    .filter(([_, category]) => category.subcategories.size > 0)
    .map(([_, category]) => ({
      ...category,
      subcategories: Array.from(category.subcategories).sort()
    }));
};

// Modify getAllTags to return flat list including both categories and subcategories
export const getAllTags = () => {
  const posts = getAllPosts();
  const tagSet = new Set();
  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      // Add the full tag (e.g., "Tech/Reinforcement Learning")
      tagSet.add(tag);
      
      // If it's a categorized tag, also add the category
      if (tag.includes('/')) {
        const category = tag.split('/')[0];
        tagSet.add(category);
      }
    });
  });
  return Array.from(tagSet).sort();
}; 