import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { articlesAPI } from '../services/api';
import ArticleList from '../components/ArticleList';
import './ArticlesPage.css';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articlesAPI.getAll();
      setArticles(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const getParentArticle = (parentId) => {
    return articles.find(a => a.id === parentId);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={fetchArticles}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-content">
          <h1>📰 BeyondChats Articles</h1>
          <p>Explore our collection of original and AI-enhanced articles</p>
          <button className="refresh-btn" onClick={fetchArticles}>
            🔄 Refresh
          </button>
        </div>
      </header>

      <main className="page-content">
        <ArticleList 
          articles={articles} 
          onArticleClick={handleArticleClick}
        />
      </main>

      {selectedArticle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <div className="modal-badges">
                <span className={`badge ${selectedArticle.is_generated ? 'badge-generated' : 'badge-original'}`}>
                  {selectedArticle.is_generated ? '🤖 AI Generated' : '📝 Original'}
                </span>
                {selectedArticle.parent_article_id && (
                  <span className="badge badge-updated">Updated Version</span>
                )}
              </div>
              <h2>{selectedArticle.title}</h2>
              <div className="modal-meta">
                <span>📅 {new Date(selectedArticle.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                {selectedArticle.source_url && (
                  <a 
                    href={selectedArticle.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    🔗 View Original Source
                  </a>
                )}
              </div>
            </div>

            {selectedArticle.parent_article_id && (
              <div className="parent-info">
                <strong>Based on:</strong> {getParentArticle(selectedArticle.parent_article_id)?.title || `Article #${selectedArticle.parent_article_id}`}
              </div>
            )}

            <div 
              className="modal-body" 
              dangerouslySetInnerHTML={{ __html: marked.parse(selectedArticle.content) }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
