'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, Club, DMConversation } from '../../../lib/api';

export default function Messages() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [dms, setDms] = useState<DMConversation[]>([]);
  const [tab, setTab] = useState<'clubs' | 'dms'>('clubs');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([api.clubs.list(), api.messages.dmList()])
      .then(([c, d]) => { setClubs(c); setDms(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Messages</h1>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {(['clubs', 'dms'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
              tab === t ? 'bg-white text-brand shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t === 'clubs' ? '👥 Clubs' : '💬 Direct'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse h-16" />
          ))}
        </div>
      ) : tab === 'clubs' ? (
        clubs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-bold text-gray-700">No club chats yet</p>
            <p className="text-gray-400 text-sm mt-1">Join a club to start chatting</p>
          </div>
        ) : (
          <div className="space-y-2">
            {clubs.map((club) => (
              <button
                key={club.id}
                onClick={() => router.push(`/chat/club/${club.id}`)}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-sm hover:border-brand/20 transition text-left card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
                  {club.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{club.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{club.member_count || 0} members</p>
                </div>
                <span className="text-gray-300">›</span>
              </button>
            ))}
          </div>
        )
      ) : (
        dms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">✉️</p>
            <p className="font-bold text-gray-700">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">Go to a club member's profile to DM them</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dms.map((dm) => (
              <button
                key={dm.other_user}
                onClick={() => router.push(`/chat/dm/${dm.other_user}`)}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-sm hover:border-brand/20 transition text-left card-hover"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
                  {dm.other_name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{dm.other_name}</p>
                  {dm.last_message && <p className="text-gray-400 text-xs truncate mt-0.5">{dm.last_message}</p>}
                </div>
                <span className="text-gray-300">›</span>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
