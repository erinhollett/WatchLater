// Made by: Erin Hollett

import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import type { Movie } from "../data/movies";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // If the input is empty, clear results and don't call the API:
    if (!trimmed) {
      setMovies([]);
      setError(null);
      return;
    }

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        if (!apiKey) {
          throw new Error(
            "TMDB API key is missing. Make sure NEXT_PUBLIC_TMDB_API_KEY is set in .env.local."
          );
        }

        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=${encodeURIComponent(
          trimmed
        )}`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`TMDB request failed with status ${res.status}`);
        }

        const data = await res.json();

        const mapped: Movie[] = data.results
          // Filtering a new movie list with "complete" movies (no missing data)
          .filter(
            (m: any) =>
              !m.adult && // No adult films!!
              m.title && // Must have a title
              m.poster_path && // Must have a poster
              m.release_date // Must have a release date
          )
          .map((m: any) => ({
            id: m.id,
            title: m.title,
            year: parseInt(m.release_date.slice(0, 4), 10),
            poster: `https://image.tmdb.org/t/p/w342${m.poster_path}`,
          }));

        setMovies(mapped);
      } catch (err) {
        console.error(err);
        setError("Error fetching data.");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleToggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const isInWatchlist = (id: number) =>
    watchlist.some((m) => m.id === id);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Search Movies
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Type a movie title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "0.5rem 0.75rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
      </div>

      {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      )}

      {query.trim() && !isLoading && !error && (
        <MovieGrid
          movies={movies}
          onToggleWatchlist={handleToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}
    </div>
  );
}