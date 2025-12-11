// Made by: Erin Hollett

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SearchBar from "../components/SearchBar";
import type { Movie } from "../data/movies";
import { MOVIES as LOCAL_MOVIES } from "../data/movies";
import { useWatchlist } from "../context/WatchlistContext";

// LAZY-LOAD and CODE SPLITING:
// MovieGrid component only gets downloaded when we show results
const MovieGrid = dynamic(() => import("../components/MovieGrid"), {
  loading: () => (
    <p style={{ textAlign: "center", marginTop: "1rem" }}>
      Loading movies...
    </p>
  ),
});

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced Input
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unified watchlist from context
  const { checked, toggle } = useWatchlist();

  // DEBOUNCE
  // wait 400ms after user stops typing before updating the query
  useEffect(() => {
    const trimmed = query.trim();
    const handle = setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, 400);

    return () => clearTimeout(handle);
  }, [query]);

    // If the input is empty, clear results and don't call the API:
    useEffect(() => {
      if (!debouncedQuery) {
        setMovies([]);
        setError(null);
        setIsLoading(false);
        return;
      }

    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY; //TMDB API Key

        // FALLBACK (for people without a TMDB key) to movies.ts data:
        if (!apiKey) {
          const localResults: Movie[] = LOCAL_MOVIES.filter((m) =>
            m.title.toLowerCase().includes(debouncedQuery.toLowerCase())
          );

          setMovies(localResults);
          setIsLoading(false);
          return;
        }

        // TMDB REQUEST: 
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=${encodeURIComponent(
          debouncedQuery
        )}`;

        const res = await fetch(url, { signal: controller.signal });

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
            year: parseInt(m.release_date.slice(0, 4), 10), // Only grabs year
            poster: `https://image.tmdb.org/t/p/w342${m.poster_path}`,
          }));

        setMovies(mapped);
      } catch (err) {
        console.error(err);
        setError("Error fetching data.");
        setMovies([]); // Clear movies
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, [debouncedQuery]);


  // Calls toggle(id) from WatchlistContext
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
