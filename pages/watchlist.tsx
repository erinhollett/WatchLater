import { useWatchlist } from "../context/WatchlistContext";
import { useEffect, useState } from "react";
import Link from "next/link";

//Define Movie
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
};


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
      setLoading(true);
      //Waits for all movies to load
      const results = await Promise.all(
        checked.map((id) => getMovieData(id))
      );
      setMovies(results.filter((m): m is Movie => m !== undefined));
      setLoading(false);
    }

    loadMovies();
  }, [checked]);

  //Loading message 
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ fontSize: "1.2rem" }}>Loading watchlist...</p>
      </div>
    );
  }

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
        <div
          className="movie-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {movies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#fff",
              }}
            >
              <Link
                href={`/details/${movie.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/no-poster.png"
                  }
                  alt={movie.title}
                  style={{
                    width: "100%",
                    aspectRatio: "2/3",
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                />

                <h3
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#000",
                  }}
                >
                  {movie.title}
                </h3>

                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                  {movie.release_date?.slice(0, 4) ?? ""}
                </p>
              </Link>

              <button
                onClick={() => toggle(movie.id)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ef4444")
                }
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
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

