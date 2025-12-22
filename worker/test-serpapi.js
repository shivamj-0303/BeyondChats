require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    const res = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',
        q: 'chatbots',
        api_key: process.env.SERPAPI_API_KEY
      }
    });
    console.log('SerpAPI result:', res.data.organic_results.slice(0,2).map(r => r.link));
  } catch (err) {
    console.error('SerpAPI error:', err.response?.data || err.message);
  }
})();
