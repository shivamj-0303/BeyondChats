<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        if ($request->boolean('latest')) {
            return response()->json(
                Article::where('is_generated', false)
                    ->orderBy('created_at', 'desc')
                    ->first()
            );
        }

        return response()->json(
            Article::latest()->get()
        );
    }

    public function show(Article $article)
    {
        return response()->json($article);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'source_url' => 'nullable|string',
            'is_generated' => 'required|integer',
            'parent_article_id' => 'nullable|integer|exists:articles,id',
        ]);

        $data['slug'] = Str::slug($data['title']);

        $article = Article::create($data);

        return response()->json($article, 201);
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string',
            'content' => 'sometimes|required|string',
        ]);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $article->update($data);

        return response()->json($article);
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function latest()
    {
        $article = Article::where('is_generated', false)
            ->where('is_processed', false)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$article) {
            return response()->json([
                'message' => 'No unprocessed original articles found'
            ], 404);
        }

        return response()->json($article);
    }

    public function markProcessed(Article $article)
    {
        $article->update(['is_processed' => true]);
        
        return response()->json([
            'message' => 'Article marked as processed',
            'article' => $article
        ]);
    }
}
