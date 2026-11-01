# Movie Watchlist

A web app for searching movies and managing your personal watchlist, powered by the [OMDb API](https://www.omdbapi.com/).
https://tomginger.github.io/movie-watchlist/

## Features

- **Movie search** — search by title with URL state management (shareable search links)
- **Watchlist** — add and remove movies, persisted via localStorage
- **Animated interactions** — SVG ring animation on add/remove, checkmark icon for saved movies
- **Dark mode** — toggle with preference saved to localStorage
- **Poster fallback** — placeholder shown when a movie has no poster image

## Tech stack

- Vanilla JavaScript (ES Modules)
- Vite
- CSS custom properties
- OMDb API
- Font Awesome icons

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/TomGinger/movie-watchlist.git
cd movie-watchlist
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```
VITE_OMDB_API_KEY=your_api_key_here
```

You can get a free API key at [omdbapi.com](https://www.omdbapi.com/apikey.aspx).

### 4. Start the dev server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```
