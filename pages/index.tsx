// pages/index.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "../context/WatchlistContext";

export default function Home() {
  const { checked, toggle } = useWatchlist();

  const posters = [
    { id: 1, title: "The Shawshank Redemption - 2010", poster: "/images/the-shawshank-redemption.png" },
    { id: 2, title: " The Godfather - 1972 ", poster: "/images/the-godfather.png" },
    { id: 3, title: "Spirited Away - 2001", poster: "/images/spirited-away.png" },
    { id: 4, title: "Pulp Fiction - 1994", poster: "/images/pulp-fiction.png" },
  ];

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

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % posters.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + posters.length) % posters.length);

  return (
    <div className="home-container">
      <main className="home-main">
        <h1 className="home-title">Welcome to Movie Hub</h1>

        {/* Carousel */}
        <div className="carousel">
          <button onClick={prevSlide} className="carousel-btn">◀</button>
          <div className="carousel-slide">
            <Image
              src={posters[carouselIndex].poster}
              alt={posters[carouselIndex].title}
              width={250}
              height={380}
            />
            <p>{posters[carouselIndex].title}</p>
          </div>
          <button onClick={nextSlide} className="carousel-btn">▶</button>
        </div>

        <button className="change-btn" onClick={changePoster}>
          Change Poster
        </button>

        {/* Featured Grid */}
        <h2 className="section-title">Featured Movies</h2>
        <div className="grid-box">
          {posters.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
            >
              <Link href={`/details/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={220}
                  height={320}
                />
                <p className="card-title">{movie.title}</p>
              </Link>
              <button
                className="watch-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToWatchlist(movie);
                }}
              >
                Add to Watchlist
              </button>
            </div>
          ))}
        </div>


      </main>

      {/* Footer */}
      <footer className="footer">© 2025 MovieHub — All Rights Reserved</footer>
    </div>
  );
}
