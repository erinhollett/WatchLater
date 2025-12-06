import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Star, Clock, Calendar, Heart, ArrowLeft } from "lucide-react";
import { useWatchlist } from "../WatchlistContext";
import Link from "next/link";

type MovieDetails = {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
  runtime: number;
  rating: number;
  genres: string[];
  overview: string;
  director: string;
  cast: string[];
  backdropUrl: string;
};

export default function MovieDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { checked, toggle } = useWatchlist();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        // Fallback data if no API key
        if (!apiKey) {
          // Use sample data for testing
          setMovie({
            id: Number(id),
            title: "Sample Movie",
            posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
            releaseDate: "January 1, 2024",
            runtime: 120,
            rating: 7.5,
            genres: ["Drama", "Thriller"],
            overview: "This is a sample movie overview. In production, this would fetch from TMDB API.",
            director: "Sample Director",
            cast: ["Actor 1", "Actor 2", "Actor 3"],
            backdropUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop"
          });
          setIsLoading(false);
          return;
        }

        // Fetch movie details from TMDB
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        
        // Fetch credits (cast and crew)
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );

        if (!movieRes.ok || !creditsRes.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();

        const director = creditsData.crew?.find((person: any) => person.job === "Director")?.name || "Unknown";
        const topCast = creditsData.cast?.slice(0, 8).map((actor: any) => actor.name) || [];

        const formattedMovie: MovieDetails = {
          id: movieData.id,
          title: movieData.title,
          posterUrl: movieData.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
          releaseDate: new Date(movieData.release_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          runtime: movieData.runtime || 0,
          rating: Math.round(movieData.vote_average * 10) / 10,
          genres: movieData.genres?.map((g: any) => g.name) || [],
          overview: movieData.overview || "No overview available.",
          director: director,
          cast: topCast,
          backdropUrl: movieData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
            : "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop"
        };

        setMovie(formattedMovie);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Movie not found"}</p>
          <Link href="/search" className="text-blue-600 hover:underline">
            Return to Search
          </Link>
        </div>
      </div>
    );
  }

  const isInWatchlist = checked.includes(movie.id);

  const toggleWatchlist = () => {
    toggle(movie.id);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Backdrop Image */}
      <div className="relative h-64 md:h-80 bg-zinc-200 dark:bg-zinc-900 overflow-hidden mt-4">
        <img 
          src={movie.backdropUrl} 
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <img 
              src={movie.posterUrl} 
              alt={movie.title}
              className="w-full md:w-64 rounded-lg shadow-2xl border-4 border-white dark:border-zinc-900"
            />
          </div>

          {/* Movie Information */}
          <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {movie.title}
            </h2>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-500" fill="#eab308" />
                <span className="font-semibold text-foreground">{movie.rating}</span>
                <span>/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{movie.releaseDate}</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{movie.runtime} min</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Watchlist Button */}
            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all mb-6 ${
                isInWatchlist 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-foreground'
              }`}
            >
              <Heart 
                size={20} 
                fill={isInWatchlist ? 'currentColor' : 'none'}
              />
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Overview</h3>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {showFullOverview || movie.overview.length <= 200
                  ? movie.overview 
                  : `${movie.overview.slice(0, 200)}...`}
              </p>
              {movie.overview.length > 200 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-2 text-sm font-medium"
                >
                  {showFullOverview ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
              {movie.director && (
                <div>
                  <span className="font-semibold text-foreground">Director:</span>
                  <span className="ml-2">{movie.director}</span>
                </div>
              )}
              {movie.cast.length > 0 && (
                <div>
                  <span className="font-semibold text-foreground">Cast:</span>
                  <span className="ml-2">{movie.cast.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
