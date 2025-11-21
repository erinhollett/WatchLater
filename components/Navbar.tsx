import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.25rem" }}>WatchLater</h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/">Home</Link>
        <Link href="/search">Search</Link>
        <Link href="/details">Movie Details</Link>
        <Link href="/watchlist">Watchlist</Link>
      </div>
    </nav>
  );
}