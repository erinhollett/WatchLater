import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOVIES } from "../../data/movies";
import { useWatchlist } from "../WatchlistContext";
import { Heart, ArrowLeft } from "lucide-react";

type MovieDetail = {
    id: number;
    title: string;
    year: string;
    poster: string;
    overview?: string;
    runtime?: number;
    genres?: { id: number; name: string }[];
    vote_average?: number;
};

export default function MovieDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { checked, toggle } = useWatchlist();

    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const movieId = Number(id);

        // 1. Try to find in local data first
        const localMovie = MOVIES.find((m) => m.id === movieId);

        if (localMovie) {
            setMovie(localMovie);
            setLoading(false);
            return;
        }

        // 2. If not found locally, try TMDB API
        const fetchMovie = async () => {
            const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

            if (!apiKey) {
                setError("Movie not found in local database and no API key provided.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
                );

                if (!res.ok) {
                    throw new Error("Movie not found");
                }

                const data = await res.json();

                setMovie({
                    id: data.id,
                    title: data.title,
                    year: data.release_date ? data.release_date.slice(0, 4) : "N/A",
                    poster: data.poster_path
                        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                        : "/images/placeholder.png", // Fallback if needed
                    overview: data.overview,
                    runtime: data.runtime,
                    genres: data.genres,
                    vote_average: data.vote_average
                });
            } catch (err) {
                console.error(err);
                setError("Failed to fetch movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!movie) return <div className="p-8 text-center">Movie not found</div>;

    const inWatchlist = checked.includes(movie.id);

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="max-w-4xl mx-auto p-6">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 w-full md:w-[300px]">
                        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={movie.poster}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                unoptimized // Using unoptimized for external images or simple setup
                            />
                        </div>
                    </div>

                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                        <div className="text-gray-600 text-xl mb-6">
                            {movie.year}
                            {movie.runtime ? ` • ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ""}
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => toggle(movie.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors ${inWatchlist
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                                    }`}
                            >
                                <Heart
                                    size={20}
                                    fill={inWatchlist ? "currentColor" : "none"}
                                />
                                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                            </button>

                            {movie.vote_average && (
                                <div className="text-lg font-medium text-yellow-600">
                                    ★ {movie.vote_average.toFixed(1)}/10
                                </div>
                            )}
                        </div>

                        {movie.genres && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genres.map(g => (
                                    <span key={g.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {movie.overview && (
                            <div>
                                <h2 className="text-2xl font-bold mb-3">Overview</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {movie.overview}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
