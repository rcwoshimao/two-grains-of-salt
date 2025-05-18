import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from './utils/blogUtils';
import Banner from './components/Banner';
import TagFilter from './components/TagFilter';
import './Home.css';

function Home() {
  const [selectedTags, setSelectedTags] = useState([]);
  const allPosts = getAllPosts();
  
  const filteredPosts = selectedTags.length > 0
    ? allPosts.filter(post => 
        selectedTags.every(tag => post.tags?.includes(tag))
      )
    : allPosts;

  return (
    <div className="home">
      <Banner />
      <TagFilter 
        selectedTags={selectedTags} 
        onTagSelect={setSelectedTags}
      />
      <div className="posts-list">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="post-preview">
            <h2>
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.summary && (
              <h4 className='post-summary'>{post.summary}</h4>
            )}
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
            <div className="post-meta">
              <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
        {filteredPosts.length === 0 && (
          <p className="no-posts">No posts found with the selected tags.</p>
        )}
      </div>
    </div>
  );
}

export default Home; 