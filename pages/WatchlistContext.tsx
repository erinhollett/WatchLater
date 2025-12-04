import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import { MOVIES } from "../data/movies";


type WatchlistContextType = {
  checked: number[];
  toggle: (id: number) => void;
  lastUnselected: string;
  showMessage: boolean;
};


const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);


//To be treated as a parent component, so all child components can take the watchlist
export function WatchlistProvider({ children }: { children: ReactNode }) {
  const LOCAL_KEY = "watchlist";

  //State to store list of movies in watchlist
  const [checked, setChecked] = useState<number[]>([]);

  //Stores title of last removed movie for message
  const [lastUnselected, setLastUnselected] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  //UseEffect for localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      //Gets watchlist from localStorage
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        setChecked(JSON.parse(stored));
      } else {
        setChecked(MOVIES.map(m => m.id)); 
      }
    }
  }, []);

  //Whenever checked changes, convert array of ID's to JSON, and save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(checked));
    }
  }, [checked]);

  
  const toggle = (id: number) => {
    setChecked(prev => {
      if (prev.includes(id)) {
        const updated = prev.filter(m => m !== id);

        const movie = MOVIES.find(m => m.id === id);
        if (movie) {
          setLastUnselected(movie.title);
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 3000);
        }

        return updated;
      }
      return [...prev, id];
    });
  };

  return (
    <WatchlistContext.Provider
      value={{ checked, toggle, lastUnselected, showMessage }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

//Hook to be used everywhere
export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  //Makes sure that all components are inside watchlistprovider
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}
