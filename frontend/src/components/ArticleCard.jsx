import React from 'react';
import './ArticleCard.css';

const ArticleCard = ({ article, onClick }) => {
  const isGenerated = article.is_generated === 1;
  
  const extractPreview = (markdownContent, maxLength = 200) => {
    const lines = markdownContent.split('\n');
    const firstParagraph = lines.find(line => {
      const trimmed = line.trim();
      return trimmed && 
             !trimmed.match(/^[-=]{3,}$/) && 
             !trimmed.startsWith('!') && 
             !trimmed.startsWith('#');
    }) || '';
    
    const cleanText = firstParagraph
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
      .trim();
    
    return cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...' 
      : cleanText;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`article-card ${isGenerated ? 'generated' : 'original'}`} onClick={onClick}>
      <div className="article-header">
        <span className={`badge ${isGenerated ? 'badge-generated' : 'badge-original'}`}>
          {isGenerated ? '🤖 AI Generated' : '📝 Original'}
        </span>
        {article.parent_article_id && (
          <span className="badge badge-updated">Updated Version</span>
        )}
      </div>
      
      <h3 className="article-title">{article.title}</h3>
      
      <p className="article-excerpt">
        {extractPreview(article.content)}
      </p>
      
      <div className="article-footer">
        <span className="article-date">
          📅 {formatDate(article.created_at)}
        </span>
        {article.source_url && (
          <a 
            href={article.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="source-link"
            onClick={(e) => e.stopPropagation()}
          >
            🔗 Source
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
