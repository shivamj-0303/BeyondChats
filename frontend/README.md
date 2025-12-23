# BeyondChats Frontend

A modern React-based frontend application for displaying and managing articles from the BeyondChats platform.

## Features

- 📰 Display all articles (original and AI-generated)
- 🔍 Filter articles by type (Original/AI-Generated)
- 🔄 Sort articles by date
- 📱 Responsive design for all devices
- 🎨 Beautiful, professional UI
- 🔗 View article sources
- 👁️ Full article modal view
- 🤖 Clear indication of AI-generated content

## Tech Stack

- React 18
- Vite
- Axios
- CSS3

## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:3000`

Make sure your Laravel backend is running at `http://127.0.0.1:8000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ArticleCard.jsx       # Individual article card component
│   ├── ArticleCard.css
│   ├── ArticleList.jsx        # List view with filters
│   └── ArticleList.css
├── pages/
│   ├── ArticlesPage.jsx       # Main articles page
│   └── ArticlesPage.css
├── services/
│   └── api.js                 # API service layer
├── App.jsx                    # Root component
├── App.css
└── main.jsx                   # Entry point
```

## API Configuration

The frontend connects to the Laravel backend API. You can configure the API base URL in `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Features Explained

### Article Types

- **Original Articles**: Scraped from BeyondChats blog (blue accent)
- **AI Generated Articles**: Enhanced versions created by the worker (purple accent)

### Filtering

- View all articles
- Filter by original only
- Filter by AI-generated only

### Sorting

- Sort by newest first
- Sort by oldest first

### Article View

Click any article card to open a detailed modal view with:
- Full article content
- Creation date
- Source link (for original articles)
- Parent article reference (for generated articles)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The app uses Vite's proxy feature to avoid CORS issues during development
- All API calls go through the `/api` prefix which is proxied to the Laravel backend
- Articles are fetched on component mount and can be refreshed manually

## License

MIT
