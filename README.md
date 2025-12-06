# WatchLater – CPAN-144-RNA Group 6

WatchLater is a website that lets users discover and view details about movies, and save movies to their personal watchlist. It integrates data from the TMDb (The Movie Database) API to display accurate movie metadata, posters, and search results.
It demonstrates multi-page routing, modular React components, basic state management, and integration with the TMDB (The Movie Database) search API.

---

## Tech Stack

- **Next.js** (React, pages router)
- **TypeScript**
- **TMDB API** for movie search results
- **lucide-react** for icons
- **CSS (globals + simple utility classes)** for layout and styling

---

## Project Structure

```text
/pages
  |_ index.tsx        # Home page – random poster scroll
  |_ search.tsx       # Movie search page (TMDB integration)
  |_ details/
      |_ [id].tsx     # Dynamic movie details page
  |_ watchlist.tsx    # Local watchlist based on MOVIES data

/components
  |_ Navbar.tsx       # Top navigation bar shared by all pages
  |_ SearchBar.tsx    # Reusable search input for the search page
  |_ MovieGrid.tsx    # Grid layout for movie cards + watchlist button

/data
  |_ movies.ts        # Local MOVIES array (for testing before we fully integrate the TMBD API)

/styles
  |_ globals.css      # Global styles, layout classes
```
