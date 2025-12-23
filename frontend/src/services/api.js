import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const articlesAPI = {
  // Get all articles
  getAll: async () => {
    const response = await api.get('/articles');
    return response.data;
  },

  // Get single article by ID
  getById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  // Get latest unprocessed article
  getLatest: async () => {
    const response = await api.get('/articles/latest');
    return response.data;
  },
};

export default api;
