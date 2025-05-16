import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../utils/blogUtils';

function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="blog-post">
      <div className="post-meta">
        <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
      </div>
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

export default BlogPost; 