'use client';
import { useEffect, useState } from 'react';
import { api, Post, Club } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [content, setContent] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const user = useAuthStore((s) => s.user);

  async function load() {
    try {
      const clubList = await api.clubs.list();
      setClubs(clubList);
      const allPosts = await Promise.all(clubList.map((c) => api.clubs.posts(c.id)));
      setPosts(
        allPosts.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );
    } catch {}
    setLoading(false);
  }

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !selectedClub) return;
    setPosting(true);
    try {
      await api.clubs.post(selectedClub, content);
      setContent('');
      load();
    } catch {}
    setPosting(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Feed</h1>
          <p className="text-gray-400 text-sm mt-1">What your clubs are up to</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-emerald-700 text-xs font-semibold">Live</span>
        </div>
      </div>

      {clubs.length > 0 && (
        <form onSubmit={submitPost} className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a run update, motivation, or anything with your club..."
            className="w-full border border-gray-100 bg-gray-50 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-brand focus:bg-white transition"
            rows={3}
          />
          <div className="flex items-center gap-3 mt-3">
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="flex-1 border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand"
            >
              <option value="">Post to club...</option>
              {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button
              type="submit"
              disabled={posting || !content.trim() || !selectedClub}
              className="bg-brand text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-brand-dark transition disabled:opacity-40"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex-1"><div className="h-3 bg-gray-100 rounded w-24 mb-2" /><div className="h-2 bg-gray-100 rounded w-16" /></div>
              </div>
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🏃</p>
          <p className="font-bold text-gray-700 text-lg">Your feed is empty</p>
          <p className="text-gray-400 mt-2">Join a club to see activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-sm">
                  {post.user_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{post.user_name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
