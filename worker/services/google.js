const axios = require('axios');

async function searchGoogle(query) {
  try {
    const res = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',
        q: query,
        api_key: process.env.SERPAPI_API_KEY,
      },
    });

    const links = res.data.organic_results
      .filter(r => r.link)
      .slice(0, 2)
      .map(r => r.link);

    if (links.length < 2) {
      console.warn('Less than 2 reference articles found.');
    }

    return links;
  } catch (err) {
    console.error('Error fetching Google results via SerpAPI:', err.response?.data || err.message);
    return [];
  }
}

module.exports = { searchGoogle };
