// Made by: Erin Hollett

import React, { useState } from "react";
import { MOVIES } from "../data/movies";
import MovieGrid from "../components/MovieGrid";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredMovies = MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Search Movies</h2>

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

      <MovieGrid movies={filteredMovies} />
    </div>
  );
}