// Made by: Erin Hollett

import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import type { Movie } from "../data/movies";
import { MOVIES as LOCAL_MOVIES } from "../data/movies";
import { useWatchlist } from "./WatchlistContext";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const { checked, toggle } = useWatchlist(); // Now using unified watchlist
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

        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY; //TMDB API

        // Fallback for testing where user does not have an API key
        if (!apiKey) {
          const localResults: Movie[] = LOCAL_MOVIES.filter((m) =>
            m.title.toLowerCase().includes(trimmed.toLowerCase())
          );

          setMovies(localResults);
          setIsLoading(false);
          return;
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
    toggle(movie.id); // Now syncs with global watchlist
  };

  const isInWatchlist = (id: number) => checked.includes(id);

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

      <SearchBar value={query} onChange={setQuery} />

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
