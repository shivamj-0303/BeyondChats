# BeyondChats Blog Platform

This repository contains a backend service that scrapes blog articles from BeyondChats, stores them in a database, and exposes APIs to manage and retrieve articles.  
The project is designed to evolve incrementally with additional services and a frontend interface.

---

## Backend Setup

### Prerequisites
- PHP 8.1 or higher
- Composer

### Installation

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### Database Setup (SQLite)

```bash
touch database/database.sqlite
php artisan migrate
```

### Scrape Blog Articles

The backend includes a console command that scrapes the oldest blog articles from BeyondChats and stores them in the database.

```bash
php artisan scrape:beyondchats-blogs
```

The scraper:
 - Detects pagination dynamically
 - Filters out non-article pages (e.g. tag pages)
 - Stores only valid blog articles

### API Endpoints

Base URL:

```bash
http://127.0.0.1:8000/api
```
Articles

```bash
GET /articles
Retrieve all articles (latest first)

GET /articles?latest=true
Retrieve the most recently created article

GET /articles/{id}
Retrieve a single article by ID

POST /articles
Create a new article

PUT /articles/{id}
Update an existing article

DELETE /articles/{id}
Delete an article

Running the Server
php artisan serve
```