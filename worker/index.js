require('dotenv').config();

const { getLatestArticle, publishArticle, markArticleProcessed } = require('./services/laravel');
const { searchGoogle } = require('./services/google');
const { scrapeArticle } = require('./services/scraper');
const { rewriteArticle } = require('./services/llm');
console.log('SERPAPI key:', process.env.SERPAPI_API_KEY);


function normalizeTitle(title) {
  return title.replace(/\s*\(Updated\)$/i, '').trim();
}

(async () => {
  try {
    console.log('Starting Phase 2 worker...');

    const article = await getLatestArticle();
    if (!article) throw new Error('No unprocessed article found');

    if (article.source_url && (
      article.source_url.includes('example.com') || 
      article.title.toLowerCase().includes('test')
    )) {
      console.log('⚠️  Skipping test article:', article.title);
      return;
    }

    console.log(`Processing article #${article.id}: ${article.title}`);

    const links = await searchGoogle(article.title);
    if (links.length < 2) throw new Error('Not enough reference articles found');

    const references = [];
    for (const link of links) {
      const refContent = await scrapeArticle(link);
      if (refContent) {
        references.push(refContent);
      }
    }

    if (references.length === 0) {
      throw new Error('Could not scrape any reference articles (all blocked or failed)');
    }

    console.log(`✓ Successfully scraped ${references.length} out of ${links.length} reference articles`);

    const updatedContent = await rewriteArticle(article.content, references);

    const baseTitle = normalizeTitle(article.title);

    await publishArticle({
      title: `${baseTitle} (Updated)`,
      content: `${updatedContent}
<hr/>
<h3>References</h3>
<ul>
${links.map(l => `<li><a href="${l}">${l}</a></li>`).join('')}
</ul>`,
      is_generated: 1,
      source_url: null,
      parent_article_id: article.id,
    });

    console.log('Published updated article');

    await markArticleProcessed(article.id);
    console.log(`Marked article #${article.id} as processed`);

    console.log('Phase 2 completed successfully.');
  } catch (err) {
    console.error('Phase 2 worker failed:', err.message);
  }
})();
