const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeArticle(url) {
  try {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const jinaUrl = `https://r.jina.ai/http://${cleanUrl}`;

    const { data } = await axios.get(jinaUrl, {
      timeout: 15000,
    });

    if (!data || data.length < 500) {
      console.warn(`⚠️  Scraped content too short from ${url}`);
      return null;
    }

    return data.trim();
  } catch (err) {
    console.warn(`⚠️  Failed to scrape ${url}`);
    return null;
  }
}

module.exports = { scrapeArticle };
