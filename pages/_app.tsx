import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { WatchlistProvider } from "../pages/WatchlistContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <WatchlistProvider>
      <Navbar />
      <main style={{ padding: "1.5rem" }}>
        <Component {...pageProps} />

      </main>
    </WatchlistProvider>
  );
}
