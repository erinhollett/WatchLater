import { useWatchlist } from "../context/WatchlistContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import MovieGrid from "../components/MovieGrid";
import type { Movie } from "../data/movies";
import { mapTmdbResultsToMovies } from "../lib/tmdb";

export default function WatchlistPage() {
  //Gets information from useWatchlist
  const { checked, toggle, lastUnselected, showMessage, getMovieData } = useWatchlist();

  //Stores objects for the watchlist
  const [movies, setMovies] = useState<Movie[]>([]);
  //Tracks whether movies are loading or not
  const [loading, setLoading] = useState(true);


  //Runs whenever a change is made to the list
  useEffect(() => {
    async function loadMovies() {
      if (checked.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // getMovieData returns TMDB-style movie objects (or undefined)
      const results = await Promise.all(
        checked.map((id) => getMovieData(id))
      );

      const safeResults = results.filter((m): m is any => !!m);

      // Reuse shared TMDB → Movie mapping
      const mapped = mapTmdbResultsToMovies(safeResults);

      setMovies(mapped);
      setLoading(false);
    }

    loadMovies();
  }, [checked, getMovieData]);

  //Loading message 
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ fontSize: "1.2rem" }}>Loading watchlist...</p>
      </div>
    );
  }

  const isInWatchlist = (id: number) => checked.includes(id);
  const handleToggleWatchlist = (movie: Movie) => {
    toggle(movie.id); // remove from watchlist here
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        My Watchlist
      </h2>

      {movies.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1rem" }}>
            Your watchlist is empty
          </p>
          <Link
            href="/search"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            Search for movies to add
          </Link>
        </div>
      ) : (
        <MovieGrid
          movies={movies}
          onToggleWatchlist={handleToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {showMessage && (
        <div
          className="unselected-message"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fee2e2",
            color: "#b00020",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "500",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          "{lastUnselected}" has been removed from your watchlist.
        </div>
      )}
    </div>
  );
}