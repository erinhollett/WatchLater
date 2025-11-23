import React from "react";
import type { Movie } from "../data/movies";

type MovieGridProps = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
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
      {movies.map((movie) => (
        <div
          key={movie.id}
          style={{
            border: "1px solid #eee",
            borderRadius: "4px",
            padding: "0.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "2 / 3",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <strong>{movie.title}</strong>
            <div style={{ fontSize: "0.9rem", color: "#555" }}>{movie.year}</div>
          </div>
        </div>
      ))}
    </div>
  );
}