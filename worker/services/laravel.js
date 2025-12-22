const axios = require('axios');

const api = axios.create({
  baseURL: process.env.LARAVEL_API_BASE_URL,
  timeout: 10000,
});

async function getLatestArticle() {
  const res = await api.get('/articles/latest');
  return res.data;
}

async function publishArticle(article) {
  return api.post('/articles', article);
}

async function markArticleProcessed(articleId) {
  return api.patch(`/articles/${articleId}/mark-processed`);
}

module.exports = {
  getLatestArticle,
  publishArticle,
  markArticleProcessed,
};
