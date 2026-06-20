export default function Download() {
  return (
    <section id="download" className="py-28 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Get RunClub</h2>
        <p className="text-gray-400 text-lg mb-14">
          Free to download. Join the running community today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="flex items-center gap-4 bg-white text-gray-900 px-8 py-5 rounded-2xl font-bold hover:bg-gray-100 transition"
          >
            <span className="text-3xl"></span>
            <div className="text-left">
              <div className="text-xs text-gray-500 font-normal">Download on the</div>
              <div className="text-xl font-extrabold leading-tight">App Store</div>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 bg-white text-gray-900 px-8 py-5 rounded-2xl font-bold hover:bg-gray-100 transition"
          >
            <span className="text-3xl">▶</span>
            <div className="text-left">
              <div className="text-xs text-gray-500 font-normal">Get it on</div>
              <div className="text-xl font-extrabold leading-tight">Google Play</div>
            </div>
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-sm mx-auto">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-brand">Free</div>
            <div className="text-gray-500 text-sm mt-1">Always</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-brand">iOS</div>
            <div className="text-gray-500 text-sm mt-1">&amp; Android</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-brand">GPS</div>
            <div className="text-gray-500 text-sm mt-1">Live tracking</div>
          </div>
        </div>

        <p className="mt-16 text-gray-600 text-sm">
          RunClub — Run Together. Go Further.
        </p>
      </div>
    </section>
  );
}
