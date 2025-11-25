import React, { useState } from "react";
import { Star, Clock, Calendar, Heart } from "lucide-react";

export default function MovieDetailsPage() {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  // The Hateful Eight movie data
  const movie = {
    id: 1,
    title: "The Hateful Eight",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
    releaseDate: "December 25, 2015",
    runtime: 168,
    rating: 7.8,
    genres: ["Western", "Mystery", "Thriller"],
    overview: "Set in post-Civil War Wyoming, bounty hunter John Ruth and his fugitive prisoner seek shelter from a blizzard at a remote cabin. Inside, they encounter a collection of strangers with questionable motives. As tensions rise and suspicions mount in the snowbound refuge, the group discovers that not everyone will survive the night. A whodunit mystery unfolds with intense dialogue and mounting paranoia.",
    director: "Quentin Tarantino",
    cast: ["Samuel L. Jackson", "Kurt Russell", "Jennifer Jason Leigh", "Walton Goggins", "Demián Bichir", "Tim Roth", "Michael Madsen", "Bruce Dern"],
    backdropUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop"
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // In Phase 2, this will update the actual watchlist state/API
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">MovieApp</h1>
        </div>
      </nav>

      {/* Backdrop Image */}
      <div className="relative h-64 md:h-80 bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
        <img 
          src={movie.backdropUrl} 
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
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
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{movie.runtime} min</span>
              </div>
            </div>

            {/* Genres */}
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
                {showFullOverview ? movie.overview : `${movie.overview.slice(0, 200)}...`}
              </p>
              <button
                onClick={() => setShowFullOverview(!showFullOverview)}
                className="text-blue-600 dark:text-blue-400 hover:underline mt-2 text-sm font-medium"
              >
                {showFullOverview ? 'Show Less' : 'Read More'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <div>
                <span className="font-semibold text-foreground">Director:</span>
                <span className="ml-2">{movie.director}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Cast:</span>
                <span className="ml-2">{movie.cast.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
}
