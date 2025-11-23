//NOTE//
// This is a hard-coded list of movie objects (just for Phase 1)
// Our team will demo with this to build the general layout, routing, and search functionality
// Later we'll replace this with real data from the TMDB API

export type Movie = {
  id: number;
  title: string;
  year: string;
  poster: string; // path to img in /public
};

export const MOVIES: Movie[] = [
  {id: 1, title: "The Shawshank Redemption", year: "2010", poster: "/images/the-shawshank-redemption.png"},
  {id: 2, title: "The Godfather", year: "1972", poster: "/images/the-godfather.png"},
  {id: 3, title: "Spirited Away", year: "2001", poster: "/images/spirited-away.png"},
  {id: 4, title: "Pulp Fiction", year: "1994", poster: "/images/pulp-fiction.png"}
];