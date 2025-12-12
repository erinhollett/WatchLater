// pages/index.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "../context/WatchlistContext";

export default function Home({ posters }: any) {
  const { checked, toggle } = useWatchlist();

  const [carouselIndex, setCarouselIndex] = useState(0);

  const changePoster = () => {
    const random = posters[Math.floor(Math.random() * posters.length)];
    setCarouselIndex(posters.indexOf(random));
  };

  const addToWatchlist = (movie: any) => {
    if (!checked.includes(movie.id)) {
      toggle(movie.id);
    }
  };

  const nextSlide = () =>
    setCarouselIndex((prev) => (prev + 1) % posters.length);

  const prevSlide = () =>
    setCarouselIndex((prev) => (prev - 1 + posters.length) % posters.length);

  return (
    <div className="home-container">
      <main className="home-main">
        <h1 className="home-title">Welcome to Movie Hub</h1>

        {/* Carousel */}
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
            <p>{posters[carouselIndex].title}</p>
          </div>

          <button onClick={nextSlide} className="carousel-btn">
            ▶
          </button>
        </div>

        <button className="change-btn" onClick={changePoster}>
          Change Poster
        </button>

        {/* Featured Grid */}
        <h2 className="section-title">Featured Movies</h2>

        <div className="grid-box">
          {posters.map((movie: any) => (
            <div key={movie.id} className="movie-card">
              <Link
                href={`/details/${movie.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={220}
                  height={320}
                />
                <p className="card-title">{movie.title}</p>
              </Link>

              <button
  className="star-btn"
  onClick={(e) => {
    e.stopPropagation();
    addToWatchlist(movie);
  }}
>
  {checked.includes(movie.id) ? "✔ Starred" : "⭐ Star This Movie"}
</button>

            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        © 2025 MovieHub — All Rights Reserved
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const API_KEY = process.env.MOVIE_API_KEY; 

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
  );

  const data = await res.json();

  const posters = data.results.slice(0, 10).map((m: any) => ({
    id: m.id,
    title: `${m.title} - ${m.release_date?.slice(0, 4)}`,
    poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
  }));

  return { props: { posters } };
}
