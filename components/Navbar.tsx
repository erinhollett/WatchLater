import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-900 text-white flex justify-between items-center px-6 py-4 shadow-md">
      <h1 className="text-xl font-bold">WatchLater</h1>

      <div className="flex gap-4 text-lg">
        <Link href="/" className="hover:text-yellow-300 transition">Home</Link>
        <Link href="/search" className="hover:text-yellow-300 transition">Search</Link>
        <Link href="/watchlist" className="hover:text-yellow-300 transition">Watchlist</Link>
      </div>
    </nav>
  );
}
