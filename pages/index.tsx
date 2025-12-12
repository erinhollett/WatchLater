// pages/index.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "../context/WatchlistContext";
import MovieGrid from "../components/MovieGrid";
import type { Movie } from "../data/movies";
import { mapTmdbResultsToMovies } from "../lib/tmdb";

type HomeProps = {
  posters: Movie[]; // same Movie type used by MovieGrid
};

export default function Home({ posters }: HomeProps) {
  const { checked, toggle } = useWatchlist();

  const [carouselIndex, setCarouselIndex] = useState(0);

  const changePoster = () => {
    const random = posters[Math.floor(Math.random() * posters.length)];
    setCarouselIndex(posters.indexOf(random));
  };

  const nextSlide = () =>
    setCarouselIndex((prev) => (prev + 1) % posters.length);

  const prevSlide = () =>
    setCarouselIndex((prev) => (prev - 1 + posters.length) % posters.length);

  // Reuse the same toggle / isInWatchlist logic as Search page
  const handleToggleWatchlist = (movie: Movie) => {
    toggle(movie.id); // add or remove from global watchlist
  };

  const isInWatchlist = (id: number) => checked.includes(id);

  return (
    <div className="home-container">
      <main className="home-main">
        <h1 className="home-title">Welcome to WatchLater</h1>

        {posters.length > 0 && (
        <div className="carousel">
          <button onClick={prevSlide} className="carousel-btn">
            ◀
          </button>

          <div className="carousel-slide">
            <Image
              src={posters[carouselIndex].poster}
              alt={posters[carouselIndex].title}
              width={250}
              height={380}
            />
              <p>
                {posters[carouselIndex].title}{" "}
                {posters[carouselIndex].year && (
                  <>({posters[carouselIndex].year})</>
                )}
              </p>
          </div>

          <button onClick={nextSlide} className="carousel-btn">
            ▶
          </button>
        </div>
        )}

        <button className="change-btn" onClick={changePoster}>
          Change Poster
        </button>

        {/* Featured Grid */}
        <h2 className="section-title">Featured Movies</h2>

      <div className="grid-box">
        <MovieGrid
          movies={posters}
          onToggleWatchlist={handleToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      </div>
      </main>

      <footer className="footer">
        © 2025 WatchLater — All Rights Reserved
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; 

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`
  );

  // Error handling:
  if (!res.ok) {
    console.error("TMDB popular request failed with status:", res.status);
    return { props: { posters: [] } };
  }

  const data = await res.json();

  // Reuse same TMDB -> Movie mapping helper, then take first 10 results
  const posters: Movie[] = mapTmdbResultsToMovies(data.results ?? []).slice(
    0,
    10
  );

  return { props: { posters } };
}
