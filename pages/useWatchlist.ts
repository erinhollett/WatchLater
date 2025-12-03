import { useState, useEffect } from "react";

export function useWatchlist(initialIds: number[]) {
  const STORAGE_KEY = "watchlist";


  const [checked, setChecked] = useState<number[]>(initialIds);
  const [hydrated, setHydrated] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setChecked(JSON.parse(stored));
    }
    setHydrated(true);
  }, []);


  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    }
  }, [checked, hydrated]);

  const toggle = (id: number) => {
    setChecked(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  return { checked, toggle, hydrated };
}

