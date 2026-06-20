'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

const nav = [
  { href: '/dashboard', label: 'Feed', icon: '🏠' },
  { href: '/clubs', label: 'Clubs', icon: '👥' },
  { href: '/run', label: 'Track Run', icon: '📍' },
  { href: '/messages', label: 'Messages', icon: '💬' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-60 h-screen bg-night border-r border-white/5 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/5">
        <span className="text-xl font-extrabold text-gradient">Mile One</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-sm ${
                active
                  ? 'bg-brand/20 text-brand border border-brand/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        {user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full text-left text-xs text-slate-600 hover:text-red-400 transition px-3 py-2 rounded-lg hover:bg-red-500/5"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
