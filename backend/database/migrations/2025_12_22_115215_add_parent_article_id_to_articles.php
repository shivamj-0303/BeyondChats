<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('parent_article_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('articles')
                  ->nullOnDelete();
            
            $table->boolean('is_processed')
                  ->default(false)
                  ->after('is_generated');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['parent_article_id']);
            $table->dropColumn(['parent_article_id', 'is_processed']);
        });
    }
};
