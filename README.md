# BeyondChats Blog Platform

A comprehensive full-stack application that scrapes blog articles, enhances them using AI, and displays them in a professional UI.

## Live Demo

**Frontend:** https://beyond-chats-lemon.vercel.app/  
**Backend API:** https://beyondchats-tw3y.onrender.com/

---

## Table of Contents

- Overview
- Architecture
- Features
- Tech Stack
- Local Setup
- Deployment Guide
- API Documentation
- Project Structure

---

## Overview

This project implements a three-phase blog article management system:

### **Phase 1: Article Scraping & CRUD APIs**
- Scrapes the 5 oldest articles from BeyondChats blog
- Stores articles in a database
- Provides RESTful CRUD APIs using Laravel

### **Phase 2: AI-Powered Article Enhancement**
- Fetches latest article from Laravel API
- Searches article title on Google
- Scrapes top 2 blog results from Google
- Uses LLM (Groq) to rewrite articles based on top-ranking content
- Publishes enhanced articles with proper citations

### **Phase 3: Professional Frontend**
- React-based responsive UI
- Displays both original and AI-enhanced articles
- Filter and sort functionality
- Modal view for full articles

---

## Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Vite + React)│
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Laravel Backend│
│   (PHP + SQLite)│
└────────┬────────┘
         │ Database
         ▼
┌─────────────────┐      ┌──────────────┐
│     Database    │◄─────┤ Node.js Worker│
└─────────────────┘      │ (Article AI) │
                         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              ┌──────────┐          ┌──────────┐
              │Google API│          │Groq LLM  │
              │(SerpAPI) │          │   API    │
              └──────────┘          └──────────┘
```

### Data Flow

1. **Scraping Phase**: Laravel Artisan command → BeyondChats website → SQLite Database
2. **Enhancement Phase**: Node.js Worker → Laravel API → Google Search → Article Scraping → LLM Processing → Laravel API
3. **Display Phase**: React Frontend → Laravel API → User Interface

---

## Features

### Backend (Laravel)
- Web scraping with Guzzle and DOMDocument
- SQLite database with migrations
- RESTful API endpoints
- CRUD operations for articles
- CORS support
- Article processing status tracking

### Worker (Node.js)
- Google search integration (SerpAPI)
- Multi-source article scraping
- AI content rewriting (Groq LLM)
- Automatic citation management
- Error handling and retry logic

### Frontend (React)
- Responsive grid layout
- Article filtering (Original/AI-Generated)
- Date-based sorting
- Modal for full article view
- Source URL display
- Clean, professional UI

---

## Tech Stack

### Backend
- **Framework**: Laravel 10
- **Language**: PHP 8.1+
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **HTTP Client**: Guzzle
- **Parser**: DOMDocument

### Worker
- **Runtime**: Node.js 18+
- **HTTP Client**: Axios
- **HTML Parser**: Cheerio
- **AI Provider**: Groq (LLaMA 3.1)
- **Search API**: SerpAPI

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Markdown**: Marked.js

---

## Local Setup

### Prerequisites
- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- SQLite3

### 1. Clone Repository

```bash
git clone https://github.com/shivamj-0303/BeyondChats.git
cd BeyondChats
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Scrape initial articles
php artisan scrape:beyondchats-blogs

# Start Laravel server
php artisan serve
```

Backend will run at: `http://127.0.0.1:8000`

### 3. Worker Setup

```bash
cd ../worker

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
# SERPAPI_API_KEY=your_serpapi_key
# GROQ_API_KEY=your_groq_key
# LARAVEL_API_BASE_URL=http://127.0.0.1:8000/api

# Run worker (make sure backend is running first)
node index.js
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## Deployment Guide

### Deploy Backend to Render (Docker-based)

1. Go to [https://render.com](https://render.com)
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Select the **backend/** directory

### Configuration
- **Environment**: Docker
- **Dockerfile**: `backend/Dockerfile`
- **Build Command**: *(leave empty – handled by Docker)*
- **Start Command**: *(leave empty – handled by Docker CMD)*

### Database Setup
1. In Render dashboard, create **New → PostgreSQL**
2. Attach it to the backend service
3. Render will auto-inject `DATABASE_URL`

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:xxxxxx
DB_CONNECTION=pgsql
DATABASE_URL=<auto-provided by Render>
```

### Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Select the **frontend/** directory

### Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variable
Add the backend API URL:

```env
VITE_API_URL=https://<your-render-backend-url>/api
```

### Option 3: Worker Deployment

#### Manual Execution:
```bash
cd worker
node index.js
```

#### Railway Cron Job:
1. Create new service on Railway
2. Set start command: `node index.js`
3. Use Railway's cron plugin for scheduling


### Important: Update CORS Settings

In `backend/config/cors.php`, update allowed origins:
```php
'allowed_origins' => [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000',
],
```

---

## API Documentation

### Base URL
- **Local**: `http://127.0.0.1:8000/api`
- **Production**: `https://beyondchats-tw3y.onrender.com/api`

### Endpoints

#### Get All Articles
```http
GET /api/articles
```
**Response:**
```json
[
  {
    "id": 1,
    "title": "Article Title",
    "content": "Article content...",
    "source_url": "https://example.com",
    "is_generated": 0,
    "is_processed": 0,
    "parent_article_id": null,
    "created_at": "2025-12-23T10:00:00.000000Z",
    "updated_at": "2025-12-23T10:00:00.000000Z"
  }
]
```

#### Get Latest Unprocessed Article
```http
GET /api/articles?latest=true
```

#### Get Single Article
```http
GET /api/articles/{id}
```

#### Create Article
```http
POST /articles
Content-Type: application/json

{
  "title": "New Article",
  "content": "Article content",
  "source_url": "https://example.com",
  "is_generated": 0,
  "parent_article_id": null
}
```

#### Update Article
```http
PUT /api/articles/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Article
```http
DELETE /api/articles/{id}
```

---

## Project Structure

```
BeyondChats/
├── backend/              # Laravel PHP Backend
│   ├── app/
│   │   ├── Console/Commands/
│   │   │   └── ScrapeBeyondChatsBlogs.php
│   │   ├── Http/Controllers/
│   │   │   └── ArticleController.php
│   │   └── Models/
│   │       └── Article.php
│   ├── database/
│   │   ├── migrations/
│   │   └── database.sqlite
│   ├── routes/
│   │   └── api.php
│   └── composer.json
│
├── worker/               # Node.js Article Enhancement Worker
│   ├── services/
│   │   ├── google.js     # Google Search Integration
│   │   ├── scraper.js    # Article Scraping
│   │   ├── llm.js        # Groq LLM Integration
│   │   └── laravel.js    # Laravel API Client
│   ├── index.js          # Main Worker Script
│   └── package.json
│
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArticleCard.jsx
│   │   │   └── ArticleModal.jsx
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md             # This file
```

---

## Environment Variables

### Backend (.env)
```env
APP_KEY=base64:...
DB_CONNECTION=sqlite or pgsql
DB_DATABASE=/path/to/database.sqlite
```

### Worker (.env)
```env
SERPAPI_API_KEY=your_serpapi_key_here
GROQ_API_KEY=your_groq_key_here
LARAVEL_API_BASE_URL=http://127.0.0.1:8000/api
```

### Frontend (Environment Variable)
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## Usage Flow

1. **Initial Setup**:
   ```bash
   php artisan scrape:beyondchats-blogs
   ```
   This scrapes 5 articles from BeyondChats.

2. **Run AI Enhancement**:
   ```bash
   cd worker
   node index.js
   ```
   This processes the latest unprocessed article.

3. **View Results**:
   - Open frontend at `http://localhost:3000`
   - View original and AI-enhanced articles side by side

---

## How to Verify the System Works

1. Open frontend live URL
2. Confirm at least 10 articles are visible
   - 5 original (is_generated = 0)
   - 5 AI-generated (is_generated = 1)
3. Open an AI-generated article
   - References section present
   - No source_url displayed
4. Check worker logs
   - Phase-2 worker runs successfully


### Worker Issues

**API Key Errors:**
- Verify `.env` file exists in worker directory
- Check API keys are valid at [SerpAPI](https://serpapi.com) and [Groq](https://console.groq.com)

**Connection Refused:**
- Ensure Laravel backend is running
- Check `LARAVEL_API_BASE_URL` in worker `.env`

### Frontend Issues

**API Connection Failed:**
- Verify backend is running
- Check proxy settings in `vite.config.js`
- Update API base URL in `src/services/api.js`

**Build Errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Learning Resources

- **Laravel Documentation**: https://laravel.com/docs
- **React Documentation**: https://react.dev
- **SerpAPI Documentation**: https://serpapi.com/docs
- **Groq API Documentation**: https://console.groq.com/docs

---

## Author

**Shivam Jangid**
- GitHub: [@shivamj-0303](https://github.com/shivamj-0303)
- Repository: [BeyondChats](https://github.com/shivamj-0303/BeyondChats)

---

## Acknowledgments

- BeyondChats for the assignment
- SerpAPI for Google Search integration
- Groq for AI processing capabilities
- Open source community for amazing tools
