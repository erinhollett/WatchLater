import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
  <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <main style={{ padding: "1.5rem", flex: 1 }}>
        <Component {...pageProps} />
      </main>

      <Footer />
    </div>
  );
}