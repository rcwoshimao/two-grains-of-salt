import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../utils/blogUtils';
import Banner from './Banner';
import './BlogPost.css';

function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  useEffect(() => {
    if (post && post.title) {
      // Set the page title to the post title
      document.title = post.title;
    } else {
      // Fallback title if post not found or no title
      document.title = 'Post Not Found';
    }
    return (
      <div className="blog-post-container">
        <Banner />
        <article className="blog-post">
          <Link to="/" className="back-link">← Back</Link>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="post-meta">
            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
          </div>
        </article>
      </div>
    );
   }, [post]);
}

export default BlogPost; 