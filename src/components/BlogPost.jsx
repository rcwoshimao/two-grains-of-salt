import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../utils/blogUtils';
import './BlogPost.css';

function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="blog-post">
      <Link to="/" className="back-link">← Back</Link>
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