import type { Movie } from "../data/movies";

// Getting only the fields we need
type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  adult?: boolean; // filter out adult films
};

export function mapTmdbResultsToMovies(results: TmdbMovie[]): Movie[] {
  return results
    .filter(
      (m) =>
        m &&
        !m.adult &&
        m.title &&
        m.poster_path &&
        m.release_date
    )
    .map((m) => ({
      id: m.id,
      title: m.title,
      year: m.release_date!.slice(0, 4),  
      poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
    }));
}