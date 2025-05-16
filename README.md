# Im starting a wackass blog

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## Deployment

This blog is automatically deployed to GitHub Pages. The deployment process is handled by GitHub Actions whenever changes are pushed to the main branch.

### Manual Deployment

If you need to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory, ready to be deployed.

### Local Development

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

- **Deployment Issues?**
  - Check GitHub Actions tab in your repository for any build errors
  - Ensure your repository name matches the `base` path in `vite.config.js`
  - Verify that GitHub Pages is enabled in your repository settings

---

## Quick Reference

- **Add or update a post:** Edit files in `src/posts/`
- **Update post dates:** `npm run update-git-history`
- **See your changes:** Restart the dev server if needed
- **Deploy:** Push to main branch (automatic) or run `npm run build` for manual deployment

---

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

