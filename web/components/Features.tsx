const features = [
  {
    icon: '👥',
    title: 'Run Clubs',
    desc: 'Create or join local run clubs. Discover groups near you and run with people who share your pace and goals.',
  },
  {
    icon: '📍',
    title: 'Live GPS Tracking',
    desc: 'Track your route in real-time with a live map. Your distance, pace, and time are always front and center.',
  },
  {
    icon: '💬',
    title: 'Club & Direct Chat',
    desc: 'Message your entire club or chat one-on-one. Coordinate meetups, celebrate PRs, and motivate each other.',
  },
  {
    icon: '📊',
    title: 'Run Stats',
    desc: 'Every run is logged automatically — distance, pace, duration, and route — so you can track progress over time.',
  },
  {
    icon: '📰',
    title: 'Club Feed',
    desc: "See what your club is up to. Share run updates, celebrate milestones, and keep your crew's energy high.",
  },
  {
    icon: '🏆',
    title: 'Community',
    desc: 'Running is better together. Build real friendships with runners in your neighborhood and beyond.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          Everything for runners
        </h2>
        <p className="text-center text-gray-500 text-lg mb-16">
          Built for the community. Designed for the road.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl border border-gray-100 hover:border-brand hover:shadow-lg transition group"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand transition">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
