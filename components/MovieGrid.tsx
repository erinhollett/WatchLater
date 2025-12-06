import React from "react";
import Link from "next/link";
import type { Movie } from "../data/movies";
import { Heart } from "lucide-react";

type MovieGridProps = {
  movies: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
};

export default function MovieGrid({
  movies,
  onToggleWatchlist,
  isInWatchlist,
}: MovieGridProps) {
  if (movies.length === 0) {
    return <p>No movies found.</p>;
  }


  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 160px)",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      {movies.map((movie) => {
        const inWatchlist = isInWatchlist(movie.id);

        return (
          <div
            key={movie.id}
            style={{
              border: "1px solid #eee",
              borderRadius: "4px",
              padding: "0.5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div>
              <Link href={`/details/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "2 / 3",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <strong>{movie.title}</strong>
                  <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {movie.year}
                  </div>
                </div>
              </Link>
            </div>

            <button
              onClick={() => onToggleWatchlist(movie)}
              className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${inWatchlist
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-zinc-200 hover:bg-zinc-300 text-black"
                }`}
            >
              <Heart
                size={14}
                fill={inWatchlist ? "currentColor" : "none"}
              />
              {inWatchlist ? "In Watchlist" : "Watchlist"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
