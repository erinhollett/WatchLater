// pages/index.tsx
import { useState } from "react";
import Image from "next/image";
import { useWatchlist } from "./WatchlistContext";

export default function Home() {
  const { checked, toggle } = useWatchlist();

  const posters = [
    { id: 1, title: "The Shawshank Redemption - 2010", poster: "/images/the-shawshank-redemption.png" },
    { id: 2, title: " The Godfather - 1972 ", poster: "/images/the-godfather.png" },
    { id: 3, title: "Spirited Away - 2001", poster: "/images/spirited-away.png" },
    { id: 4, title: "Pulp Fiction - 1994", poster: "/images/pulp-fiction.png" },
  ];

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [modalMovie, setModalMovie] = useState<any>(null);

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
              onClick={() => setModalMovie(movie)}
            >
              <Image
                src={movie.poster}
                alt={movie.title}
                width={220}
                height={320}
              />
              <p className="card-title">{movie.title}</p>
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

        {/* Modal */}
        {modalMovie && (
          <div className="modal-bg" onClick={() => setModalMovie(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <Image
                src={modalMovie.poster}
                alt={modalMovie.title}
                width={300}
                height={430}
              />
              <h3>{modalMovie.title}</h3>
              <button className="close-btn" onClick={() => setModalMovie(null)}>Close</button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">© 2025 MovieHub — All Rights Reserved</footer>
    </div>
  );
}
