export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white pt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-orange-100 text-brand text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Available on iOS &amp; Android
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900">
            Run Together.<br />
            <span className="text-brand">Go Further.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-lg">
            Join local run clubs, track your runs with live GPS, and stay connected
            with your running community — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#download"
              className="bg-brand text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition shadow-lg"
            >
              Download Free
            </a>
            <a
              href="#features"
              className="border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-brand hover:text-brand transition"
            >
              See Features
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-72 h-[560px] bg-gray-900 rounded-[48px] shadow-2xl p-3 relative">
            <div className="w-full h-full bg-gradient-to-b from-brand to-orange-400 rounded-[42px] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-8 pb-4">
                <span className="text-white font-extrabold text-lg">RunClub</span>
                <span className="text-white/60 text-sm">9:41</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-white px-6 text-center">
                <div className="text-6xl mb-4">🏃</div>
                <p className="text-5xl font-extrabold">5.2 km</p>
                <p className="text-orange-200 mt-2 text-lg">28:14 · 5.4 min/km</p>
                <div className="mt-6 bg-white/20 rounded-2xl px-6 py-3 w-full">
                  <p className="text-sm text-orange-100">Morning Runners Club</p>
                  <p className="font-bold mt-1">3 members running now</p>
                </div>
              </div>
              <div className="flex justify-around px-4 pb-6 pt-4 border-t border-white/20">
                {['🏠', '👥', '▶️', '💬', '👤'].map((icon, i) => (
                  <span key={i} className="text-xl opacity-80">{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
