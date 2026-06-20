export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-2xl font-extrabold text-brand">RunClub</span>
        <a
          href="#download"
          className="bg-brand text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-orange-600 transition"
        >
          Download App
        </a>
      </div>
    </nav>
  );
}
