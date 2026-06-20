'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { useAuthStore } from '../../store/authStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, loadUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => { loadUser(); }, []);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <span className="text-2xl font-extrabold text-gradient animate-pulse">Mile One</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-60 p-8 max-w-4xl">{children}</main>
    </div>
  );
}
