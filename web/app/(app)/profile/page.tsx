'use client';
import { useEffect, useState } from 'react';
import { api, Run } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.runs.my().then(setRuns).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const validRuns = runs.filter((r) => r.pace && r.pace > 0);
  const avgPace = validRuns.length
    ? (validRuns.reduce((a, r) => a + (r.pace || 0), 0) / validRuns.length).toFixed(1)
    : '--';

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Profile</h1>

      <div className="bg-night rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-extrabold text-3xl">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-slate-400 text-sm">{user.email}</p>
          {user.bio && <p className="text-slate-300 mt-1 text-sm">{user.bio}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { value: Number(user.total_distance || 0).toFixed(1), label: 'Total km' },
          { value: String(runs.length), label: 'Runs' },
          { value: avgPace, label: 'Avg min/km' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-extrabold text-brand">{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Recent Runs</h3>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : runs.length === 0 ? (
          <p className="text-gray-400 text-sm">No runs yet — head to Track Run to start!</p>
        ) : (
          <div className="space-y-1">
            {runs.slice(0, 10).map((run) => (
              <div key={run.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{run.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(run.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand text-sm">{run.distance?.toFixed(2)} km</p>
                  {run.duration && <p className="text-gray-400 text-xs">{formatTime(run.duration)}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="w-full border border-red-200 text-red-400 rounded-xl py-3 font-bold text-sm hover:bg-red-50 transition"
      >
        Log out
      </button>
    </div>
  );
}
