import { Link } from 'react-router-dom';
import { getAllPosts } from './utils/blogUtils';
import Banner from './components/Banner';
import './Home.css';

function Home() {
  const posts = getAllPosts();

  return (
    <div className="home">
      <Banner />
      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.slug} className="post-preview">
            <h2>
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.summary? (
              <h4 className='post-summary'> {post.summary} </h4>
            ): null}
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