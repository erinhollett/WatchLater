import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

//Define Movie
type Movie = {
  id: number;
  title: string;
  //poster_path?: string;
  //overview?: string;
  [key: string]: any;
};

//Type for Context
type WatchlistContextType = {
  checked: number[];                
  toggle: (id: number) => Promise<void>;
  lastUnselected: string;
  showMessage: boolean;
  getMovieData: (id: number) => Promise<Movie | undefined>; 
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);


//To be treated as a parent component so all child components can take the watchlist
export function WatchlistProvider({ children }: { children: ReactNode }) {
  const LOCAL_KEY = "watchlist";
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  //State to store the list of movies in the watchlist
  const [checked, setChecked] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  

  //Stores the title of the last removed movie for the alert at the bottom
  const [lastUnselected, setLastUnselected] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  //Fetch Movie data from TMDB
  //Returns a promise, that will turn into a movie after it is recieved
  const fetchMovie = async (id: number): Promise<Movie | undefined> => {
    try {
      const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
      if (!res.ok) return undefined;
      return await res.json();
    } catch (err) {
      console.error("TMDB error:", err);
      return undefined;
    }
  };

  //API call for movie data
  const getMovieData = async (id: number) => {
    return await fetchMovie(id);
  };

  //Load Wacthlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      setChecked(JSON.parse(stored));
    } else {
      //No movies in watchlist until added
      setChecked([]);
    }
    setIsInitialized(true);
  }, []);

  //Save watchlist whenever checked movies change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(checked));
    }
  }, [checked, isInitialized]);

//Add or remove a movie from the list
const toggle = async (id: number) => {
  setChecked(prev => {
    if (prev.includes(id)) {
      //If the movie is currently in the watchlist, remove it
      const updated = prev.filter(m => m !== id);

      //Show removed message
      getMovieData(id).then(movie => {
        if (movie) {
          setLastUnselected(movie.title);
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 3000);
        }
      });

      return updated;
    } else {
      //If the movie is not in the watchlist, add it
      return [...prev, id];
    }
  });
};


  return (
    <WatchlistContext.Provider
      value={{
        checked,
        toggle,
        lastUnselected,
        showMessage,
        getMovieData,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

//Hook to be used everywhere
export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  //Makes sure that all components are inside watchlistprovider
  if (!ctx)
    throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}

export default WatchlistProvider;
