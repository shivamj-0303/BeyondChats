import React, { useState } from 'react';
import ArticleCard from './ArticleCard';
import './ArticleList.css';

const ArticleList = ({ articles, onArticleClick }) => {
  const [filter, setFilter] = useState('all'); // all, original, generated
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest

  const filteredArticles = articles
    .filter(article => {
      if (filter === 'original') return article.is_generated === 0;
      if (filter === 'generated') return article.is_generated === 1;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return new Date(a.created_at) - new Date(b.created_at);
    });

  return (
    <div className="article-list-container">
      <div className="filters">
        <div className="filter-group">
          <label>Filter:</label>
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All ({articles.length})
            </button>
            <button 
              className={filter === 'original' ? 'active' : ''} 
              onClick={() => setFilter('original')}
            >
              Original ({articles.filter(a => a.is_generated === 0).length})
            </button>
            <button 
              className={filter === 'generated' ? 'active' : ''} 
              onClick={() => setFilter('generated')}
            >
              AI Generated ({articles.filter(a => a.is_generated === 1).length})
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="no-articles">
          <p>No articles found.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filteredArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article}
              onClick={() => onArticleClick(article)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
