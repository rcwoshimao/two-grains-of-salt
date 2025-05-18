import { getTagsByCategory } from '../utils/blogUtils';
import './TagFilter.css';

function TagFilter({ selectedTags, onTagSelect }) {
  const tagCategories = getTagsByCategory();

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };

  const isTagSelected = (tag) => selectedTags.includes(tag);
  const isCategorySelected = (category) => selectedTags.includes(category);

  return (
    <div className="tag-filter">
      <div className="categories-list">
        {tagCategories.map(category => (
          <div key={category.name} className="category-group">
            <button
              className={`category ${isCategorySelected(category.name) ? 'selected' : ''}`}
              onClick={() => toggleTag(category.name)}
            >
              {category.name}
            </button>
            <div className="subcategories">
              {category.subcategories.map(subcategory => {
                const fullTag = `${category.name}/${subcategory}`;
                return (
                  <button
                    key={fullTag}
                    className={`tag ${isTagSelected(fullTag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(fullTag)}
                  >
                    {subcategory}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {selectedTags.length > 0 && (
          <button
            className="clear-tags"
            onClick={() => onTagSelect([])}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

export default TagFilter; 