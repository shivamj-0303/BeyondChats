<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;
use Illuminate\Support\Str;

class ScrapeBeyondChatsBlogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:beyondchats-blogs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape the 5 oldest BeyondChats blog articles and store them in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting BeyondChats blog scrape...');

        $client = new Client([
            'timeout' => 10,
        ]);

        $response = $client->get('https://beyondchats.com/blogs/');
        $html = (string) $response->getBody();

        $crawler = new Crawler($html);

        $this->info('Fetched blogs page successfully.');

        $paginationPages = $crawler
            ->filter('a[href*="/blogs/page/"]')
            ->each(function ($node) {
                $href = $node->attr('href');

                if (preg_match('#/blogs/page/(\d+)/#', $href, $matches)) {
                    return (int) $matches[1];
            }

            return null;
        });

        $paginationPages = array_filter($paginationPages);

        if (empty($paginationPages)) {
            $this->warn('No pagination found, defaulting to page 1');
            $lastPageNumber = 1;
        } else {
            $lastPageNumber = max($paginationPages);
        }

        $lastPageUrl = "https://beyondchats.com/blogs/page/{$lastPageNumber}/";

        $this->info("Last page detected: {$lastPageUrl}");

        $response = $client->get($lastPageUrl);
        $lastPageHtml = (string) $response->getBody();

        $lastPageCrawler = new Crawler($lastPageHtml);

        $this->info('Fetched last blog page successfully');

        $collectedArticles = [];

        for ($page = $lastPageNumber; $page >= 1; $page--) {
            $pageUrl = "https://beyondchats.com/blogs/page/{$page}/";
            $this->info("Scanning page: {$pageUrl}");

            $pageHtml = (string) $client->get($pageUrl)->getBody();
            $pageCrawler = new Crawler($pageHtml);

            $urls = $pageCrawler
                ->filter('h2 a')
                ->each(fn ($node) => $node->attr('href'));

            $urls = array_reverse($urls);

            foreach ($urls as $url) {
                if (
                    preg_match('#^https://beyondchats\.com/blogs/[^/]+/$#', $url)
                    && !in_array($url, $collectedArticles)
                ) {
                    $collectedArticles[] = $url;
                    $this->info("Found article: {$url}");
                }

                if (count($collectedArticles) === 5) {
                    break 2;
                }
            }
        }
        foreach ($collectedArticles as $url) {
            try {
                $this->info("Scraping article: {$url}");

                $html = (string) $client->get($url)->getBody();
                $articleCrawler = new Crawler($html);

                $title = trim($articleCrawler->filter('h1')->first()->text());
                $slug = Str::slug($title);

                if (Article::where('slug', $slug)->exists()) {
                    $this->warn("Skipping existing article: {$title}");
                    continue;
                }

                $content = $articleCrawler->filter('article')->count()
                    ? $articleCrawler->filter('article')->html()
                    : implode("\n", $articleCrawler->filter('p')->each(fn ($p) => $p->text()));

                Article::create([
                    'title' => $title,
                    'slug' => $slug,
                    'content' => $content,
                    'source_url' => $url,
                    'is_generated' => 0,
                ]);

                $this->info("Saved article: {$title}");
            } catch (\Throwable $e) {
                $this->error("Failed to scrape {$url}: {$e->getMessage()}");
            }
        }

        return Command::SUCCESS;
    }
}
