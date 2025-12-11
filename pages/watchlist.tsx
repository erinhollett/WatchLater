import { useWatchlist } from "../pages/WatchlistContext";
import { MOVIES } from "../data/movies";
import Link from "next/link";

export default function WatchlistPage() {
  const { checked, toggle, lastUnselected, showMessage } = useWatchlist();

  const visibleMovies = MOVIES.filter(movie => checked.includes(movie.id));

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem", fontWeight: "bold" }}>
        My Watchlist
      </h2>

      {visibleMovies.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1rem" }}>
            Your watchlist is empty
          </p>
          <Link href="/search" style={{ color: "#2563eb", textDecoration: "underline" }}>
            Search for movies to add
          </Link>
        </div>
      ) : (
        <div className="movie-grid" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "2rem" 
        }}>
          {visibleMovies.map(movie => (
            <div className="movie-card" key={movie.id} style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#fff"
            }}>
              <Link href={`/details/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  style={{
                    width: "100%",
                    aspectRatio: "2/3",
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                />
                <h3 style={{ 
                  marginTop: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#000"
                }}>
                  {movie.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                  {movie.year}
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
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}

      {showMessage && (
        <div className="unselected-message" style={{
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
          zIndex: 1000
        }}>
          "{lastUnselected}" has been removed from your watchlist.
        </div>
      )}
    </div>
  );
}
