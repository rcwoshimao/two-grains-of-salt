import { Link } from 'react-router-dom';
import { getAllPosts } from './utils/blogUtils';
import './Home.css';

function Home() {
  const posts = getAllPosts();

  return (
    <div className="home">
      <h1>My Blog</h1>
      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.slug} className="post-preview">
            <h2>
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            <div className="post-meta">
              <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Home; 