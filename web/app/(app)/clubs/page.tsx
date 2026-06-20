'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, Club } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [creating, setCreating] = useState(false);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  async function load() {
    try {
      setClubs(await api.clubs.list());
    } catch {}
    setLoading(false);
  }

  async function createClub(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.clubs.create({ name, description, location });
      setName(''); setDescription(''); setLocation('');
      setShowCreate(false);
      load();
    } catch {}
    setCreating(false);
  }

  async function joinClub(id: string) {
    try { await api.clubs.join(id); load(); } catch {}
  }

  async function leaveClub(id: string) {
    try { await api.clubs.leave(id); load(); } catch {}
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Clubs</h1>
          <p className="text-gray-400 text-sm mt-1">Find your crew or start one</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
        >
          + New Club
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createClub} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-lg mb-4">Create a club</h3>
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Club name"
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this club about? (optional)"
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition resize-none"
              rows={2}
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or neighborhood (optional)"
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="bg-brand text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition disabled:opacity-40"
            >
              {creating ? 'Creating...' : 'Create Club'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-gray-400 text-sm hover:text-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-24" />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">👟</p>
          <p className="font-bold text-gray-700 text-lg">No clubs yet</p>
          <p className="text-gray-400 mt-2">Create the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {clubs.map((club) => {
            const isOwner = club.owner_id === user?.id;
            return (
              <div key={club.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                    {club.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{club.name}</p>
                    {club.location && <p className="text-gray-400 text-xs">📍 {club.location}</p>}
                    {club.description && <p className="text-gray-400 text-sm truncate">{club.description}</p>}
                    <p className="text-xs text-gray-300 mt-0.5">{club.member_count || 0} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isOwner ? (
                    <>
                      <span className="text-xs bg-indigo-50 text-brand px-3 py-1 rounded-full font-semibold border border-indigo-100">Owner</span>
                      <button
                        onClick={() => router.push(`/chat/club/${club.id}`)}
                        className="bg-emerald-50 text-accent px-4 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition"
                      >
                        Chat
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(`/chat/club/${club.id}`)}
                        className="bg-emerald-50 text-accent px-4 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => leaveClub(club.id)}
                        className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-50 hover:text-red-400 transition"
                      >
                        Leave
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
