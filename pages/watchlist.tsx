import React, { useState, useEffect } from "react";
import { MOVIES } from "../data/movies";

export default function WatchlistPage() {

  const [checked, setChecked] = useState<number[]>(MOVIES.map(m => m.id));


  const [lastUnselected, setLastUnselected] = useState<string>("");


  const [showMessage, setShowMessage] = useState(false);

  const toggle = (id: number) => {
    setChecked(prev => {
      if (prev.includes(id)) {
        const updated = prev.filter(m => m !== id);
        const movie = MOVIES.find(m => m.id === id);
        if (movie) {
          setLastUnselected(movie.title);
          setShowMessage(true);


          setTimeout(() => setShowMessage(false), 3000);
        }
        return updated;
      } else {
        return [...prev, id];
      }
    });
  };


  const visibleMovies = MOVIES.filter(movie => checked.includes(movie.id));

  return (
    <div>

      <div className="movie-grid">
        {visibleMovies.map(movie => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.poster} alt={movie.title} />
            <h3>{movie.title}</h3>

            <div className="checkbox-container">
              <input
                type="checkbox"
                className="movie-checkbox"
                checked={checked.includes(movie.id)}
                onChange={() => toggle(movie.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Message at the bottom*/}
      {showMessage && (
        <div className="unselected-message">
          "{lastUnselected}" has been removed from your watchlist.
        </div>
      )}
    </div>
  );
}
