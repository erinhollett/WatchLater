import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const posters = [
    {
      id: 1,
      title: "Pulp Fiction - 1994",
      poster: "/images/pulp-fiction.png",
    },
    {
      id: 2,
      title: "Spirited Away - 2001",
      poster: "/images/spirited-away.png",
    },
    {
      id: 3,
      title: "The Godfather - 1972",
      poster: "/images/the-godfather.png",
    },
    {
      id: 4,
      title: "The Shawshank Redemption - 2010",
      poster: "/images/the-shawshank-redemption.png",
    },
  ];

  const [selectedPoster, setSelectedPoster] = useState(posters[0]);

  const changePoster = () => {
    const random = posters[Math.floor(Math.random() * posters.length)];
    setSelectedPoster(random);
  };

  return (
    <div className="home-container">
      <main className="home-main">
        <h1 className="home-title">Welcome to Movie Hub</h1>

        <div className="poster-box">
          <Image
            src={selectedPoster.poster}
            alt={selectedPoster.title}
            width={300}
            height={450}
            className="poster-image"
          />
          <h2 className="poster-title">{selectedPoster.title}</h2>
        </div>

        <button className="change-btn" onClick={changePoster}>
          Change Poster
        </button>
      </main>
    </div>
  );
}
