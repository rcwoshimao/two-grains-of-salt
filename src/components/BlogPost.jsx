import { useParams, Link } from 'react-router-dom';
import { getPostById, getPostBySlug } from '../utils/blogUtils';
import './BlogPost.css';

function BlogPost() {
  const { id, slug } = useParams();
  const post = id ? getPostById(id) : getPostBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
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
  );
}

export default BlogPost; 