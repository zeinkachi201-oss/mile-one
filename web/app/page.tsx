'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const stats = [
  { value: 12400, label: 'Active Runners', suffix: '+' },
  { value: 840, label: 'Run Clubs', suffix: '+' },
  { value: 5200000, label: 'KM Tracked', suffix: '+' },
];

const features = [
  {
    icon: '👥',
    title: 'Run Clubs',
    desc: 'Create or discover clubs in your area. Find people who run at your pace, your time, your vibe.',
    color: 'from-indigo-500/10 to-indigo-500/5',
    border: 'hover:border-indigo-300',
  },
  {
    icon: '📍',
    title: 'Live GPS Tracking',
    desc: 'Start a run and watch your route build in real time. Distance, pace, and time — always visible.',
    color: 'from-emerald-500/10 to-emerald-500/5',
    border: 'hover:border-emerald-300',
  },
  {
    icon: '💬',
    title: 'Club & Direct Chat',
    desc: 'Group chats for your club. One-on-one DMs with members. All inside Mile One.',
    color: 'from-violet-500/10 to-violet-500/5',
    border: 'hover:border-violet-300',
  },
  {
    icon: '📊',
    title: 'Personal Stats',
    desc: 'Every run logged. Every km counted. See your progress build over weeks and months.',
    color: 'from-sky-500/10 to-sky-500/5',
    border: 'hover:border-sky-300',
  },
  {
    icon: '📰',
    title: 'Club Feed',
    desc: 'Share runs, post updates, and cheer each other on. Your club activity all in one place.',
    color: 'from-pink-500/10 to-pink-500/5',
    border: 'hover:border-pink-300',
  },
  {
    icon: '🌍',
    title: 'Built for Community',
    desc: 'Running is better when it\'s shared. Mile One is built around the people, not the numbers.',
    color: 'from-amber-500/10 to-amber-500/5',
    border: 'hover:border-amber-300',
  },
];

const feed = [
  { name: 'Sarah K.', time: '2 min ago', text: 'Just hit a new 5K PB! 22:14 🔥', km: '5.0', club: 'Downtown Dash' },
  { name: 'Marcus T.', time: '8 min ago', text: 'Morning loop done. Perfect conditions out there today', km: '8.3', club: 'Early Birds' },
  { name: 'Priya M.', time: '15 min ago', text: 'First run with the club — already love this crew 🙌', km: '3.2', club: 'Sunday Strides' },
];

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) { setDisplay(value); clearInterval(timer); }
          else setDisplay(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-extrabold text-gradient">
        {display >= 1000000
          ? (display / 1000000).toFixed(1) + 'M'
          : display >= 1000
          ? (display / 1000).toFixed(0) + 'K'
          : display}{suffix}
      </div>
      <div className="text-slate-400 mt-2 text-sm font-medium">{label}</div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-light border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gradient">Mile One</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-brand transition">Features</a>
            <a href="#community" className="hover:text-brand transition">Community</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-brand transition px-4 py-2">
              Log in
            </Link>
            <Link href="/signup" className="bg-brand text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-brand-dark transition shadow-md shadow-indigo-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen bg-night flex items-center pt-16 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl animate-float-delay" />

        <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 bg-accent rounded-full dot-live" />
                <span className="text-emerald-400 text-sm font-medium">Live runs happening now</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-extrabold text-white leading-none tracking-tight mb-6">
                Keep<br />
                <span className="text-gradient">Moving</span><br />
                Together.
              </h1>
              <p className="text-slate-400 text-xl max-w-md mb-10 leading-relaxed">
                Mile One connects you with local runners, tracks every km, and keeps your crew talking — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="bg-brand text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-dark transition glow group flex items-center justify-center gap-2"
                >
                  Start Running Free
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <a
                  href="#features"
                  className="glass text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Live feed preview */}
            <div className="flex-1 flex justify-center animate-float">
              <div className="w-80 space-y-3">
                {feed.map((item, i) => (
                  <div
                    key={i}
                    className="glass rounded-2xl p-4"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">
                        {item.name[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.name}</p>
                        <p className="text-slate-500 text-xs">{item.club} · {item.time}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-accent font-bold text-sm">{item.km} km</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">{item.text}</p>
                  </div>
                ))}
                <div className="glass rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-slate-400 text-sm">47 runners active now</span>
                  <span className="w-2 h-2 bg-accent rounded-full dot-live" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((s) => (
              <AnimatedStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-brand text-sm font-bold uppercase tracking-widest">Everything you need</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
              Built for runners.<br />Powered by community.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No noise. No leaderboards pressure. Just you, your crew, and the road.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`scroll-reveal bg-gradient-to-br ${f.color} border border-gray-100 ${f.border} rounded-2xl p-7 card-hover cursor-default`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="community" className="py-28 bg-night relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-30" />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Three steps to your first run
            </h2>
            <p className="text-slate-400 text-lg">Simple by design. Powerful by community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Join or create a club', desc: 'Find runners near you or start your own club in under 60 seconds.', icon: '🏁' },
              { step: '02', title: 'Track your run', desc: 'Hit start and your route, pace, and distance are captured live via GPS.', icon: '📍' },
              { step: '03', title: 'Stay connected', desc: 'Chat with your club, share your run, and keep each other moving.', icon: '💬' },
            ].map((item, i) => (
              <div key={item.step} className="scroll-reveal glass rounded-2xl p-8 text-center" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-brand font-black text-xs tracking-widest mb-3">{item.step}</div>
                <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-8 right-8 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10 scroll-reveal">
          <h2 className="text-5xl font-extrabold text-white mb-6">Ready to keep moving?</h2>
          <p className="text-indigo-200 text-xl mb-10">
            Free forever. No gear required. Just show up.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-brand px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-indigo-50 transition shadow-2xl group"
          >
            Create your account
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <p className="text-indigo-300 mt-6 text-sm">No credit card. No catch.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-night py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-extrabold text-gradient text-xl">Mile One</span>
          <p className="text-slate-500 text-sm">Keep Moving Together.</p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <Link href="/login" className="hover:text-white transition">Log in</Link>
            <Link href="/signup" className="hover:text-white transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
