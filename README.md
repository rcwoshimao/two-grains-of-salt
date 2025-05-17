# Two Grains of Salt

A minimalist blog built with React and Vite, featuring support for Markdown, LaTeX equations, and code snippets.

## Writing Blog Posts

Blog posts are stored as JavaScript files in the `src/posts` directory. Each post should export:
- `title`: The post title
- `date`: Publication date
- `slug`: Unique identifier for the post URL
- `content`: The post content in Markdown format

### Formatting Guide

#### Code Formatting

1. **Inline Code**
   ```markdown
   Use single backticks for inline code: `console.log("Hello")`
   ```

2. **Code Blocks**
   ````markdown
   Use triple backticks with optional language name:
   ```javascript
   function hello() {
       console.log("Hello, world!");
   }
   ```
   ````

#### LaTeX Math

1. **Inline Math**
   ```markdown
   Use backticks with dollar signs for inline equations: \`$E = mc^2$\`
   ```

2. **Block Math**
   ````markdown
   Use math code blocks for displayed equations:
   ```math
   \sum_{i=1}^n i = \frac{n(n+1)}{2}
   ```
   ````

#### Other Markdown Features

- **Headers**: Use `#` for different levels
- **Lists**: Use `-` or `*` for bullet points
- **Blockquotes**: Use `>` for quotes
- **Links**: Use `[text](url)` format
- **Bold**: Use `**text**`
- **Italic**: Use `*text*`

### Example Post

```javascript
export const title = "My Blog Post";
export const date = "2024-03-19";
export const slug = "my-blog-post";
export const content = `
# My Blog Post

Here's some inline code: \`console.log("Hello")\`

Here's a code block:
\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}
\`\`\`

Here's an inline equation: \`$E = mc^2$\`

Here's a block equation:
\`\`\`math
\\sum_{i=1}^n i = \\frac{n(n+1)}{2}
\`\`\`
`;
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Styling

The blog uses CSS variables for theming:
- `--background-color`: Main background
- `--text-body-color1`: Primary text color
- `--text-body-color2`: Secondary text color
- `--text-title-color1`: Primary title color
- `--text-title-color2`: Secondary title color

Styles for different elements are defined in:
- `src/App.css`: Global styles and theme variables
- `src/components/BlogPost.css`: Post-specific styles
- `src/Home.css`: Homepage styles

## Deployment

The blog is configured for deployment on GitHub Pages. Push changes to the main branch to trigger automatic deployment.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## Local Development

To run the project locally:

```bash
npm install
npm run dev
```

---

## Managing Blog Posts

### Creating or Updating a Blog Post

1. **Create or Edit a Post**
   - Add a new `.js` file in `src/posts/` for a new post, or edit an existing one.
   - Use this template:
     ```js
     export const metadata = {
       title: "Your Post Title",
       slug: "your-post-slug"
     };

     export const content = `
     # Your Post Title

     Your content here in Markdown!
     `;
     ```
   - Only `title` and `slug` are required in `metadata`. Dates are handled automatically.

2. **Commit Your Changes**
   - Use Git to commit your new or updated post:
     ```bash
     git add src/posts/your-post.js
     git commit -m "Add/update blog post: Your Post Title"
     ```

3. **Update Post Dates**
   - Run the following command to update creation and update dates for all posts based on Git history:
     ```bash
     npm run update-git-history
     ```
   - This generates/updates `src/data/git-history.json`, which the site uses to display post dates.

4. **Start or Restart the Dev Server**
   - If your dev server is running, restart it to pick up changes in the JSON file.

---

## Troubleshooting

- **Dates Not Updating?**
  - Make sure you committed your changes to Git before running `npm run update-git-history`.
  - If you add a new post but don't see dates, check that the file is tracked by Git and committed.

- **Error: `git-history.json` Not Found**
  - Run `npm run update-git-history` to generate the file.
  - Make sure the `src/data/` directory exists.

- **Error: Node.js/child_process in Browser**
  - All Git operations are handled by the script, not in the browser. If you see this error, make sure you're not trying to use Node.js modules in your React code.

- **General Steps Not Working?**
  - Double-check that you're using Node.js v16+ and have Git installed.
  - If you change the structure of your posts, update the script and utilities accordingly.

---

## Quick Reference

- **Add or update a post:** Edit files in `src/posts/`
- **Update post dates:** `npm run update-git-history`
- **See your changes:** Restart the dev server if needed

---

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

