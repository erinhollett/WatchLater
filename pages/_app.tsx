import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main style={{ padding: "1.5rem" }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}