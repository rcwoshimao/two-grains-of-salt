export const metadata = {
  title: "Template Post",
  tags: [], // e.g., ["Tech/Reinforcement Learning"] or ["Life/Philosophy"]
  summary: "A brief summary of your post",
  hidden: true // This post won't show up in the blog list
};

export const content = `
# Template Post

## Basic Structure
This is a template for creating new blog posts. Copy this file and modify it for your new post.

## Adding Images
You can add images in two ways:

### 1. Local Images
Create a directory in \`src/assets/posts/your-post-slug/\` for post-specific images.
![Image Description](image-name.png "Optional caption")

### 2. External Images
You can also use external image URLs:
![External Image](https://example.com/image.jpg "External image caption")

## Math Equations
You can add math equations using KaTeX:

### Inline Math
This is an inline equation: $E = mc^2$

### Block Math
\`\`\`math
\\frac{d}{dx}(x^n) = nx^{n-1}
\`\`\`

## Lists
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

## Code Blocks
\`\`\`javascript
function example() {
  console.log("Hello, world!");
}
\`\`\`

## Quotes
> This is a blockquote. Use it for important notes or citations.

## Links
[Link text](https://example.com)

## Process for Creating a New Post
1. Copy this template file
2. Rename it to your post name (e.g., \`my-new-post.js\`)
3. Update the metadata
4. Write your content
5. Test locally
6. Commit and push your changes
`; 