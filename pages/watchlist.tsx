import { useWatchlist } from "../pages/WatchlistContext";
import { MOVIES } from "../data/movies";

export default function WatchlistPage() {
  const { checked, toggle, lastUnselected, showMessage } = useWatchlist();

  const visibleMovies = MOVIES.filter(movie => checked.includes(movie.id));

  return (
    <div>
      <div className="movie-grid">
        {visibleMovies.map(movie => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.poster} alt={movie.title} />
            <h3>{movie.title}</h3>

            <input
              type="checkbox"
              checked={checked.includes(movie.id)}
              onChange={() => toggle(movie.id)}
            />
          </div>
        ))}
      </div>

      {showMessage && (
        <div className="unselected-message">
          "{lastUnselected}" has been removed from your watchlist.
        </div>
      )}
    </div>
  );
}

